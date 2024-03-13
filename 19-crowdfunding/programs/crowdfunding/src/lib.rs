use anchor_lang::prelude::*;

declare_id!("MGhpSzfSMQveQZH5u9qiDr19op7W1gNpwYwHajB7Yy5");

#[program]
pub mod crowdfunding {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
