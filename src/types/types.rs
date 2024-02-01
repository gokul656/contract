use std::collections::HashMap;
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub enum Instruction {
    CreateTopic(VoteTopic),
    CastVoteTopic(CastVote),
    GetVotes(GetVoteCount),
}

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct VoteTopic {
    pub title: String,
    pub options: Vec<String>,
}

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct CastVote {
    pub title: String,
    pub option: String,
}

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct GetVoteCount {
    pub title: String,
}


#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct RateState {
    pub count: u32,
}

const MARKER_SIZE: usize = 8;

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct Context {
    pub votes: HashMap<String, HashMap<String, u32>>,
}

impl Context where HashMap<String, HashMap<String, u32>>: BorshDeserialize + BorshSerialize + Default + Sized {
    pub fn size_of() -> usize {
        core::mem::size_of::<HashMap<String, Vec<String>>>() + MARKER_SIZE
    }

    pub fn add(&mut self, vote_topic: VoteTopic) -> &mut Self {
        let mut map: HashMap<String, u32> = HashMap::new();
        for x in vote_topic.options {
            map.insert(x, 0);
        }
        
        self.votes.insert(vote_topic.title, map);
        self
    }

    pub fn cast_vote(&mut self, title: String, option: String) {
        let vote = self.votes.entry(title.clone()).or_insert_with(HashMap::new);
        let count = vote.entry(option.clone()).or_insert(0);
        *count += 1;
    }

    pub fn get_all(mut self) -> HashMap<String, HashMap<String, u32>> {
        self.votes
    }

    pub fn get_vote(mut self, title: String) -> HashMap<String, u32> {
        let map = &HashMap::new();
        return self.votes.get(&title).unwrap_or(map).clone();
    }

    pub fn pack(&self, buffer: &mut [u8]) -> usize {
        // Get the length of the PDA account storage size
        let buffer_length = buffer.len();

        // Check if the size of the `MARKER` is less than the size  of the `buffer_length`
        if buffer_length < MARKER_SIZE {
            // If the size is smaller, return an error indicating this to the user
            // return Err(AccountStoreError::BufferTooSmallForMarker);
            return 0;
        }
        // Serialize the user data using `borsh`

        let mut data: Vec<u8> = Vec::new();
        self.votes.serialize(&mut data).unwrap();

        // Get the data length
        let data_length = data.len();

        // Check if the sum of the size of the `data_length` and the `MARKER_SIZE` is
        // greater than the `buffer_length`
        if buffer_length < data_length + MARKER_SIZE {
            // return Err(AccountStoreError::BufferTooSmallForData);
            return 0;
        }

        // Copy the `data_length` to the buffer as the `MARKER`
        buffer[0..=7].copy_from_slice(&data_length.to_le_bytes());

        // Copy the data into the buffer.
        // If the data is smaller than the buffer then the space filled with
        // zeroes is left intact
        buffer[8..=data_length + 7].copy_from_slice(&data);

        return data_length + 8usize;
    }

    pub fn unpack(buffer: &[u8]) -> Result<Context, &'static str> {
        // Get the length of the PDA account storage
        let buffer_length = buffer.len();

        // Check if the size of the `MARKER` is less than the size  of the `buffer_length`
        if buffer_length < MARKER_SIZE {
            return Err("");
        }

        // Convert the `MARKER` bytes to and array of `[u8; 8] `
        // since `usize::from_le_bytes` only accepts `[u8; 8]`
        let marker: [u8; 8] = match buffer[0..MARKER_SIZE].try_into() {
            Ok(value) => value,
            Err(_) => return Err("AccountStoreError::CorruptedMarker"),
        };
        // Get the last index of the valid data
        let byte_length = usize::from_le_bytes(marker);

        // Check if the last index of the valid buffer is greater than the PDA storage size
        if byte_length > buffer_length {
            return Err("AccountStoreError::CorruptedStorage");
        }

        // Collect the valid data by skipping the `MARKER_SIZE` of `8 bytes`
        // and iterating the rest of the bytes until the index marked by the `byte_length`
        let data = buffer
            .iter()
            .skip(8)
            .take(byte_length)
            .map(|byte| *byte)
            .collect::<Vec<u8>>();

        return if byte_length != 0 {
            let data = HashMap::try_from_slice(&data).unwrap(); // Handle error as you see fit
            Ok(Context { votes: data })
        } else {
            // If the `byte_length` is zero it means that no previous
            // data had been written to the PDA account previously
            // so return the `Default` representation of the data structure represented
            // by the generic `HashMap<String, HashMap<String, u32>>`
            Ok(Context { votes: HashMap::default() })
        };
    }
}