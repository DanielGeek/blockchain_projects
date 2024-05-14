# How to handle big accounts

## How to run 
To run the tests:
1. Install Solana CLI: https://docs.solana.com/de/cli/install-solana-cli-tools
2. Open Terminal: solana-test-validator to start a local validator
3. In vs code in the terminal run: "npm install" to install the node packages needed to run the tests.
4. Then: anchor build && anchor deploy 
5. Copy the deployed program id from the terminal and paste it into the lib.rs and the anchor.toml file
6. Then: anchor test or anchor test --skip-local-validator depending on your node version

Maybe you also need to install Anchor or Rust: https://www.anchor-lang.com/docs/installation

[Video walkthrough](https://www.youtube.com/watch?v=zs_yU0IuJxc&ab_channel=Solana)

## Explanation of Solana Memory and Zero Copy 

The heap and stack memory in the Solana runtime are very limited. We have 4Kb to work with on the stack and 32Kb on the heap.
The stack increased by 10Kb per loaded account. These limits are quickly reached when writing a program. 
By default in Anchor all account structs are being loaded will be on the stack. If you reach the stack limit you will an error similar to this: 

```js
Stack offset of -30728 exceeded max offset of -4096 by 26632 bytes, please minimize large stack variables
```
(See test stacksize.ts)

To prevent this to a certain degree you can Box your account. What this means is that the account will move to the heap and there will only a pointer of 16 Bytes will be saved on the Stack.
This can be done like this: 

```js
#[derive(Accounts)]
pub struct Example {
    pub my_acc: Box<Account<'info, MyData>>
}
```

If your account gets bigger it gets a bit more complicated. Solana does not allow Cross Program Invocations with accounts bigger than 10Kb.
Anchor does use a CPI to initialize all new accounts. So it calls the System Program internally to create a new account.
You can allocate more memory to your account like this with an extra transaction: 

```js
Program: 

    #[derive(Accounts)]
    #[instruction(len: u16)]
    pub struct IncreaseAccoutSize<'info> {
        #[account(mut, 
            realloc = len as usize, 
            realloc::zero = true, 
            realloc::payer=signer)]
        pub data_holder: Account<'info, DataHolderNoZeroCopy>,
        #[account(mut)]
        pub signer: Signer<'info>,
        #[account(address = system_program::ID)]
        pub system_program: Program<'info, System>,
    }

Ts: 
    let txRealloc = await program.methods
    .increaseAccountData(20480)
    .accounts({
    signer: signer.publicKey,
    dataHolder: pdaNoZeroCopy,
    systemProgram: anchor.web3.SystemProgram.programId
    })
    .signers([signer])
    .rpc();
```

You can then call this multiple times adding 10240 in each transaction. 
When loading an account which is bigger than the 10240 bytes though you will get an out of memory exception.
(See test: withoutzerocopy)

If you need an even bigger account size you need to look into Zero Copy serialization. 
You should only use zero copy for large accounts that can not be Borsh/Anchor serialized without hitting the heap or stack limits. 
With zero copy deserialization, all bytes from the account's backing `RefCell<&mut [u8]>` are simply re-interpreted as a reference to the data structure. No allocations or copies necessary. This is how we can get around the stack and heap limitations.

For the account you want to serialize with zero copy you need to add this zero_copy to the account: 

```js
#[account(zero_copy)]
```

Then you can define the repr which definies how the data will be packed. By default repr[c] will be used, so the C serialization. 
This will by default break options and enums in your structs because the C serialization is different from the Borsh serialization.
You can also use:  

```js
#[repr(C)]
or
#[repr(packed)]
```

which should remove all the extra space that the C serialization adds.

Here is a list of different repr types <br/>
[Repr types](https://doc.rust-lang.org/nomicon/other-reprs.html)<br/>
[Space needed for different data types](https://book.anchor-lang.com/anchor_references/space.html)<br/>

Keep in mind that when you use different repr types the data may not deserialize as expected in the client because for example options and enums may be packed differently.

Next you replace Account with AccountLoader and then in you anchor program you can access the data using .load_mut()?
Like this you can interact with the data of the account using copy_from_slice or mem copy without loading the whole account into memory.

```js

    pub fn set_data(ctx: Context<SetData>, string_to_set: String, index: u64) -> Result<()> {
        let text_to_add_to_the_account = str::from_utf8(string_to_set.as_bytes()).unwrap();
        msg!(text_to_add_to_the_account);

        // Since the account is bigger that the heap space as soon as we access the whole account we will get a out of memory error        
        // let string = &ctx.accounts.data_holder.load_mut()?.long_string;
        // let complete_string = str::from_utf8(string).unwrap(); 
        // msg!("DataLength: {}", string.len());
        // msg!("CompleteString: {}", complete_string);

        // So the solution is use copy_from_slice and mem copy when we want to access data in the big account
        ctx.accounts
            .data_holder
            .load_mut()?
            .long_string[((index) as usize)..((index +912) as usize)]
            .copy_from_slice(string_to_set.as_bytes());

        Ok(())
    }

    // This will initialize the PDA with the maximum possible size of 10 Kb
    #[derive(Accounts)]
    pub struct Initialize<'info> {
        #[account(init, seeds = [b"data_holder_zero_copy_v0", 
        signer.key().as_ref()], 
        bump, 
        payer=signer, 
        space= 10 * 1024 as usize)]
        pub data_holder: AccountLoader<'info, DataHolder>,
        #[account(mut)]
        pub signer: Signer<'info>,
        #[account(address = system_program::ID)]
        pub system_program: Program<'info, System>,
    }

    #[account(zero_copy)]
    #[repr(packed)]
    pub struct DataHolder {
        // 40952 = 40960 - 8 (account desciminator)
        pub long_string: [u8; 40952],
    }

    #[derive(Accounts)]
    #[instruction(len: u16)]
    pub struct IncreaseZeroCopy<'info> {
        #[account(mut, 
            realloc = len as usize, 
            realloc::zero = true, 
            realloc::payer=signer)]
        pub data_holder: AccountLoader<'info, DataHolder>,
        #[account(mut)]
        pub signer: Signer<'info>,
        #[account(address = system_program::ID)]
        pub system_program: Program<'info, System>,
    }
}
```

[Great Blog article about size Anchor differences](https://www.sec3.dev/blog/all-about-anchor-account-size)

Here is a game anchor program that uses Zero Copy for a game grid: <br/> 
[Anchor Program Game](https://github.com/Woody4618/SolPlay_Unity_SDK/blob/main/Assets/SolPlay/Examples/SolHunter/AnchorProgram/src/state/game.rs)
And here another example saving items in a zero copy account: 
[Anchor Program Items](https://github.com/coral-xyz/anchor/issues/651)




