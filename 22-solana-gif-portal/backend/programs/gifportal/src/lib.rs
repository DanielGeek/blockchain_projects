use anchor_lang::prelude::*;
use anchor_lang::solana_program::entrypoint::ProgramResult;

declare_id!("5KttK3fLpAWDQ4QgbqSchYXudf4jEtPVJRif6x9yUcKX");

#[program]
pub mod gifportal {
    use anchor_lang::solana_program::entrypoint::ProgramResult;
 
    use super::*;
 
    pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> ProgramResult {
        Ok(())
    }
}
 
#[derive(Accounts)]
pub struct StartStuffOff{}
