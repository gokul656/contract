const {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  TransactionInstruction,
  Keypair,
  clusterApiUrl,
  sendAndConfirmRawTransaction,
} = require("@solana/web3.js");
const { struct, u32, blob, u8, seq, u6 } = require("@solana/buffer-layout");
const BufferLayout = require("buffer-layout");

// Connection to a Solana cluster
// const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const connection = new Connection(clusterApiUrl("devnet"));

// Replace with your program ID and account public key
const programId = new PublicKey("mmmx9RQULq7ohDAUnKRmcDFnNuYLuiw9UNW3E39Y2pm");
const fromPublicKey = new PublicKey(
  "evNyex5RWTW8QVaDZhMyhkx38tmVwMHSAC3NsifEezp"
);

const voteParamsLayout = BufferLayout.struct([
  BufferLayout.u32("title"),
  BufferLayout.u32("option"),
]);

const instruction_data = new Uint8Array([voteParamsLayout]);

// Your parameters
const params = {
  title: "Best",
  option: "BTC",
};

// Allocate a buffer for the transaction data
const instructionData = Buffer.alloc(voteParamsLayout.span);

// Encode the data into the allocated buffer
// voteParamsLayout.encode(
//   {
//     titleLength: params.title.length,
//     title: Buffer.from(params.title),
//     optionLength: params.option.length,
//     option: Buffer.from(params.option), // Joining options into a comma-separated string
//   },
//   instructionData
// );

// Replace with your target account and destination public key
// const toPublicKey = new PublicKey("target_account_public_key_here");

const privateKeyArray = [
  65, 69, 97, 213, 131, 144, 249, 244, 132, 30, 6, 139, 226, 67, 206, 20, 34,
  100, 7, 83, 237, 50, 140, 63, 148, 221, 72, 195, 143, 3, 19, 46, 9, 182, 216,
  125, 79, 131, 229, 79, 161, 98, 27, 97, 113, 73, 244, 173, 221, 180, 103, 150,
  2, 185, 152, 26, 222, 97, 9, 170, 124, 152, 143, 85,
];

const from = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));

// Create a Solana transaction
const transaction = new Transaction().add(
  new TransactionInstruction({
    keys: [{ pubkey: from.publicKey, isSigner: true, isWritable: true }],
    programId,
    instructionData,
  })
);

const bytes = transaction.serialize();

// Sign the transaction
// ... sign the transaction with your private key ...

// Send and confirm the transaction
sendAndConfirmTransaction(connection, transaction, [from])
  .then((txHash) => {
    console.log("Transaction successful:", txHash);
  })
  .catch((error) => {
    // console.error("Transaction failed:", error);
    console.error("Transaction failed:", error);

    // Output additional error details
    if (error?.logs) {
      console.error("Transaction Logs:", error.logs);
    }

    // If available, output the raw transaction data
    if (transaction?.serialize) {
      console.error("Raw Transaction Data:", transaction.serialize());
    }
  });
