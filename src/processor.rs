use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::account_info::{AccountInfo, next_account_info};
use solana_program::entrypoint::ProgramResult;
use solana_program::msg;
use solana_program::pubkey::Pubkey;
use crate::state;
use crate::types::types::Instruction;

pub fn setup(_program_id: &Pubkey, accounts: &[AccountInfo], instruction_data: &[u8]) -> ProgramResult {

    let account_iter = &mut accounts.iter();
    let account = next_account_info(account_iter).unwrap();

    let instruction_res = Instruction::try_from_slice(instruction_data);

    match instruction_res {
        Ok(instruction) => {
            match instruction {
                Instruction::CreateTopic(data ) => {
                    state::create_vote(accounts, account, data).expect("TODO: panic message");
                },
                Instruction::CastVoteTopic(data) => {
                    state::cast_vote(account, data).expect("TODO: panic message");
                },
                Instruction::GetVotes(data) => {
                    state::get_votes(account, data).expect("TODO: panic message");
                },
            }
        },
        Err(err) => msg!("error while matching {:?}", err)
    }

    return Ok(());
}

#[cfg(test)]
mod test {
    use super::*;
    use solana_program::clock::Epoch;
    use std::mem;
    use crate::types::types::Instruction::{CastVoteTopic, CreateTopic, GetVotes};
    use crate::types::types::{CastVote, Context, GetVoteCount, VoteTopic};

    #[test]
    fn test_func() {
        let program_id = Pubkey::default();
        let key = Pubkey::default();
        let mut lamports = 0;

        let mut data = vec![0; 2 * mem::size_of::<Context>()];
        let owner = Pubkey::default();
        let account = AccountInfo::new(
            &key,
            false,
            true,
            &mut lamports,
            &mut data,
            &owner,
            false,
            Epoch::default(),
        );

        let accounts = vec![account.clone()];

        let mut instruction_data: Vec<u8> = Vec::new();
        let vote_topic = CreateTopic(VoteTopic{
            title: "best".to_string(),
            options: ["BTC".to_string(), "ETH".to_string(), "SOL".to_string()].to_vec()
        });
        vote_topic.serialize(&mut instruction_data).unwrap();
        setup(&program_id, &accounts, &instruction_data).unwrap();

        let mut instruction_data: Vec<u8> = Vec::new();
        let vote_topic = CreateTopic(VoteTopic{ title: "best_2".to_string(), options: ["ETH".to_string()].to_vec() });
        vote_topic.serialize(&mut instruction_data).unwrap();
        setup(&program_id, &accounts, &instruction_data).unwrap();

        let mut instruction_data: Vec<u8> = Vec::new();
        let vote_topic = CastVoteTopic(CastVote{ title: "best".to_string(), option: "ETH".to_string() });
        vote_topic.serialize(&mut instruction_data).unwrap();
        setup(&program_id, &accounts, &instruction_data).unwrap();

        let mut instruction_data: Vec<u8> = Vec::new();
        let vote_topic = GetVotes(GetVoteCount{title: "best".to_string()});
        vote_topic.serialize(&mut instruction_data).unwrap();
        setup(&program_id, &accounts, &instruction_data).unwrap();

        // assert_eq!(
        //     RateState::try_from_slice(&accounts[0].data.borrow())
        //         .unwrap()
        //         .count,
        //     1
        // );

        // setup(&program_id, &accounts, &instruction_data).unwrap();
        // assert_eq!(
        //     RateState::try_from_slice(&accounts[0].data.borrow())
        //         .unwrap()
        //         .count,k
        //     2
        // );
    }

    #[test]
    fn test_retrieval() {
        let program_id = Pubkey::default();
        let key = Pubkey::default();
        let mut lamports = 0;

        let mut data = vec![0; 2 * mem::size_of::<Context>()];
        let owner = Pubkey::default();
        let account = AccountInfo::new(
            &key,
            false,
            true,
            &mut lamports,
            &mut data,
            &owner,
            false,
            Epoch::default(),
        );

        let accounts = vec![account];

        let mut instruction_data: Vec<u8> = Vec::new();
        let vote_topic = GetVotes(GetVoteCount{title: "".to_string()});
        vote_topic.serialize(&mut instruction_data).unwrap();
        setup(&program_id, &accounts, &instruction_data).unwrap();
    }
}

