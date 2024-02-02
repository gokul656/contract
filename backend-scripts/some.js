const { struct, u8, str, vec } = require("@coral-xyz/borsh");

const {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  TransactionInstruction,
  Keypair,
  clusterApiUrl,
} = require("@solana/web3.js");

async function main() {
  // Connection to a Solana cluster
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Your program ID
  const programId = new PublicKey(
    "7LJmK8BCwu5ukDwMyxRLvgZt8zLcoLhjBBgBAsoHS6vm"
  );

  // Define the data structure for the instruction
  const voteParamsLayout = {
    // index: 0,
    layout: struct([
      u8("index"),
      str("title"),
      vec(str("options"), "options"),
    ]),
  };

  // Encode the data into a buffer
  // let dataBuffer = Buffer.alloc(voteParamsLayout.span);
  let dataBuffer = Buffer.alloc(1000);

  let layoutFields = Object.assign(
    // { instruction: voteParamsLayout.index },
    { title: "yazh", options: ["btc", "sol", "eth"] }
  );

  voteParamsLayout.layout.encode({ index: 0, ...layoutFields }, dataBuffer);

  //   voteParamsLayout.layout.encode(
  //     { title: "yazh", options: ["btc", "sol", "eth"] },
  //     dataBuffer
  //   );

  const instructionBuffer = dataBuffer.slice(
    0,
    voteParamsLayout.layout.getSpan(dataBuffer)
  );

  // Signer information
  const privateKeyArray = [
    65, 69, 97, 213, 131, 144, 249, 244, 132, 30, 6, 139, 226, 67, 206, 20, 34,
    100, 7, 83, 237, 50, 140, 63, 148, 221, 72, 195, 143, 3, 19, 46, 9, 182,
    216, 125, 79, 131, 229, 79, 161, 98, 27, 97, 113, 73, 244, 173, 221, 180,
    103, 150, 2, 185, 152, 26, 222, 97, 9, 170, 124, 152, 143, 85,
  ];
  const signer = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));

  console.log(signer.publicKey.toString());

  // Create a transaction instruction
  const instruction = new TransactionInstruction({
    keys: [{ pubkey: signer.publicKey, isSigner: true, isWritable: true }],
    programId,
    data: instructionBuffer, // The properly encoded data
  });

  // Create and sign the transaction
  let transaction = new Transaction().add(instruction);
  transaction.feePayer = signer.publicKey; // Set the fee payer
  let blockhash = await connection.getRecentBlockhash();
  transaction.recentBlockhash = blockhash.blockhash;

  // Send the transaction
  sendAndConfirmTransaction(connection, transaction, [signer])
    .then((txHash) => {
      console.log("Transaction successful:", txHash);
    })
    .catch((error) => {
      console.error("Transaction failed:", error);
      if (error?.logs) {
        console.error("Transaction Logs:", error.logs);
      }
    });
}

main();
