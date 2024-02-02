const {
  clusterApiUrl,
  Connection,
  Transaction,
  TransactionInstruction,
  PublicKey,
  sendAndConfirmTransaction,
  Keypair,
} = require("@solana/web3.js");

const BufferLayout = require('buffer-layout')

const { u32, ns64, struct, s16, Layout, seq } = require("@solana/buffer-layout");

// const { string } = require("buffer-layout");

let payer = Keypair.generate();

async function test() {
  // create an empty transaction
  const transaction = new Transaction({});

  const connection = new Connection(clusterApiUrl("devnet"));

  let params = {
    title: "best crypto",
    option: "BTC",
  };

  let allocateStruct = {
    index: 0,
    layout: struct([
      // u32("instruction"),
      seq(u32(), 32, "title"),
      seq(u32(), 32, "option"),
      //   "option",
      //   vec(String("utf-8", 3), "option"),
    ]),
  };

  console.log(allocateStruct.layout.span)

  let data = Buffer.alloc(allocateStruct.layout.span);
  allocateStruct.encode(myObject, buffer)
  let layoutFields = Object.assign({ instruction: allocateStruct.index }, params);
  // allocateStruct.layout.encode(layoutFields, data);

  

  console.log(data);

  // add a hello world program instruction to the transaction
  transaction.add(
    new TransactionInstruction({
      keys: [],
      programId: new PublicKey("mmmx9RQULq7ohDAUnKRmcDFnNuYLuiw9UNW3E39Y2pm"),
      data: data,
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
