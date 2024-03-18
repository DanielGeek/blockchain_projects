use anchor_lang::prelude::*;
use chainlink_solana as chainlink;

declare_id!("7ABtiu5wEQJLgha9dUE6BvuhH5GPhwyU1aGRtoPAt6Es");

#[program]
pub mod chainlink_solana_dapp {
    use super::*;
    pub fn execute(ctx: Context<Execute>) -> ProgramResult {
        let round = chainlink::lates_round_data(
            ctx.accounts.chainlink_program.to_account_info(),
            ctx.accounts.chainlink_feed.to_account_info())?;
        let result_account = &mut ctx.accounts.result_account;
        result_account.value = round.answer;
        Ok(())
    }
}
