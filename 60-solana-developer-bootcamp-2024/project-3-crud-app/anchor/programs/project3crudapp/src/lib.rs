#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod project3crudapp {
    use super::*;

  pub fn close(_ctx: Context<CloseProject3crudapp>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.project3crudapp.count = ctx.accounts.project3crudapp.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.project3crudapp.count = ctx.accounts.project3crudapp.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeProject3crudapp>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.project3crudapp.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeProject3crudapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Project3crudapp::INIT_SPACE,
  payer = payer
  )]
  pub project3crudapp: Account<'info, Project3crudapp>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseProject3crudapp<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub project3crudapp: Account<'info, Project3crudapp>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub project3crudapp: Account<'info, Project3crudapp>,
}

#[account]
#[derive(InitSpace)]
pub struct Project3crudapp {
  count: u8,
}
