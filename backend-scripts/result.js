const {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  TransactionInstruction,
  Keypair,
  clusterApiUrl,
} = require("@solana/web3.js");

async function result (){
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const callerAccountAddress = "7LJmK8BCwu5ukDwMyxRLvgZt8zLcoLhjBBgBAsoHS6vm";
const callerAccount = await connection.getAccountInfo(
  new PublicKey(callerAccountAddress)
);

// Extract and parse the result data from the account data
const resultData = callerAccount.data.slice(0, 4); // Assuming result is a u32
const parsedResult = new Uint32Array(resultData.buffer)[0];

console.log("Result data:", parsedResult);
}

result();
