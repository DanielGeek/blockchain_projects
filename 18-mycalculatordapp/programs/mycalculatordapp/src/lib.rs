use anchor_lang::prelude::*;

declare_id!("A51G5oX5vaKvYgEXotRTMDxiqRFnwBVSELVnZ6hcKtat");

#[program]
pub mod mycalculatordapp {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
