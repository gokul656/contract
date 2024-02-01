use std::ops::Add;
use solana_program::account_info::AccountInfo;
use solana_program::entrypoint::ProgramResult;
use solana_program::msg;
use crate::types::types::{CastVote, Context, GetVoteCount, VoteTopic};

pub fn create_vote(_accounts: &[AccountInfo], account_info: &AccountInfo, vote: VoteTopic) -> ProgramResult {
    msg!("create topic");
    let mut data = Context::unpack(&account_info.data.borrow());
    match data {
        Ok(_) => {
            let mut data = data.unwrap();
            data.add(vote);
            data.pack(&mut &mut account_info.data.borrow_mut()[..]);

            msg!("{:?}", data.votes)
        }
        Err(err) => {
            msg!(err)
        }
    }

    msg!("create topic completed");
    Ok(())
}

pub fn cast_vote(account_info: &AccountInfo, vote: CastVote) -> ProgramResult{
    msg!("cast vote");
    let mut data = Context::unpack(&account_info.data.borrow());
    match data {
        Ok(_) => {
            let mut data = data.unwrap();
            data.cast_vote(vote.title, vote.option);
            data.pack(&mut &mut account_info.data.borrow_mut()[..]);
        }
        Err(err) => {
            msg!(err)
        }
    }
    msg!("cast vote completed");
    Ok(())
}

pub fn get_votes(account_info: &AccountInfo, query: GetVoteCount) -> ProgramResult {
    msg!("get vote");
    let mut data = Context::unpack(&account_info.data.borrow());
    match data {
        Ok(_) => {
            let data = data.unwrap();
            msg!("{:?}", data.get_vote(query.title))
        },
        Err(err) => {
            msg!(err)
        }
    }

    msg!("get vote completed");
    return Ok(());
}