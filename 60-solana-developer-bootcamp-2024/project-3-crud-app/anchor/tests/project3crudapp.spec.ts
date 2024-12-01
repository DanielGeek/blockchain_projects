import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Project3crudapp} from '../target/types/project3crudapp'

describe('project3crudapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Project3crudapp as Program<Project3crudapp>

  const project3crudappKeypair = Keypair.generate()

  it('Initialize Project3crudapp', async () => {
    await program.methods
      .initialize()
      .accounts({
        project3crudapp: project3crudappKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([project3crudappKeypair])
      .rpc()

    const currentCount = await program.account.project3crudapp.fetch(project3crudappKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Project3crudapp', async () => {
    await program.methods.increment().accounts({ project3crudapp: project3crudappKeypair.publicKey }).rpc()

    const currentCount = await program.account.project3crudapp.fetch(project3crudappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Project3crudapp Again', async () => {
    await program.methods.increment().accounts({ project3crudapp: project3crudappKeypair.publicKey }).rpc()

    const currentCount = await program.account.project3crudapp.fetch(project3crudappKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Project3crudapp', async () => {
    await program.methods.decrement().accounts({ project3crudapp: project3crudappKeypair.publicKey }).rpc()

    const currentCount = await program.account.project3crudapp.fetch(project3crudappKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set project3crudapp value', async () => {
    await program.methods.set(42).accounts({ project3crudapp: project3crudappKeypair.publicKey }).rpc()

    const currentCount = await program.account.project3crudapp.fetch(project3crudappKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the project3crudapp account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        project3crudapp: project3crudappKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.project3crudapp.fetchNullable(project3crudappKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
