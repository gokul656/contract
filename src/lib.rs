pub mod processor;
pub mod types;
pub mod state;

use solana_program::entrypoint;
use processor::setup;

entrypoint!(setup);

