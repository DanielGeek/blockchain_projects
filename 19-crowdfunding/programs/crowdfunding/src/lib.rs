use anchor_lang::prelude::*;

declare_id!("MGhpSzfSMQveQZH5u9qiDr19op7W1gNpwYwHajB7Yy5");

#[program]
pub mod crowdfunding {
    use super::*;

    pub fn create(ctx: Context<Create>, name: String, description: String) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        campaign.name = name;
        campaign.description = description;
        campaign.amount_donated = 0;
        campaign.admin = *ctx.accounts.user.key;
        Ok(())
    }
}
