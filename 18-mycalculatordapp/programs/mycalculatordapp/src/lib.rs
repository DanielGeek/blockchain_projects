use anchor_lang::prelude::*;

declare_id!("A51G5oX5vaKvYgEXotRTMDxiqRFnwBVSELVnZ6hcKtat");

#[program]
pub mod mycalculatordapp {
    use super::*;
    pub fn create(ctx: Context<Create>, init_message: String) -> ProgramResult {
      let calculator = &mut ctx.accounts.calculator;
      calculator.greeting = init_message;
      OK(())
    }
}
