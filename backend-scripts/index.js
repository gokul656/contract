const {
  clusterApiUrl,
  Connection,
  Transaction,
  TransactionInstruction,
  PublicKey,
  sendAndConfirmTransaction,
  Keypair,
} = require("@solana/web3.js");

async function test() {
  // create an empty transaction
  const transaction = new Transaction();

  const connection = new Connection(clusterApiUrl("devnet"));

  transaction.add(
    new TransactionInstruction({
      keys: [],
      programId: new PublicKey("CB8BWK7DVq1hnreBq59w2WwZyGauJuuGrwD6iJ5VTc7k"),
    })
  );

  const privateKeyArray = [
    65, 69, 97, 213, 131, 144, 249, 244, 132, 30, 6, 139, 226, 67, 206, 20, 34,
    100, 7, 83, 237, 50, 140, 63, 148, 221, 72, 195, 143, 3, 19, 46, 9, 182,
    216, 125, 79, 131, 229, 79, 161, 98, 27, 97, 113, 73, 244, 173, 221, 180,
    103, 150, 2, 185, 152, 26, 222, 97, 9, 170, 124, 152, 143, 85,
  ];

  const from = Keypair.fromSecretKey(new Uint8Array(privateKeyArray));

  // send the transaction to the Solana cluster
  console.log("Sending transaction...");
  const txHash = await sendAndConfirmTransaction(connection, transaction, [
    from,
  ]);
  console.log("Transaction sent with hash:", txHash);
}

test();
