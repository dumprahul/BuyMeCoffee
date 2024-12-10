import React, { useState } from "react";
import { motion } from "framer-motion";
import bg_img from "../lib/pexels-codioful-7135057.jpg";
import { ethers } from "ethers";
import { contract_abi } from "../contracts/contract_abi";
import { contract_address } from "../contracts/contract_address";

export default function BuyMeCoffee() {
  const { ethereum } = window;
  const [showCard, setShowCard] = useState(false); // Card is initially hidden
  const [account, setAccount] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [txHash, setTxHash] = useState("");


  // Connect to MetaMask
  const connect_wallet = async () => {
    if (!ethereum) {
      alert("MetaMask is not installed!");
      return;
    }
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      setShowCard(true); // Show the card after wallet connection
      console.log("Connected account:", accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Send Coffee Function
  const sendCoffee = async () => {
    if (!ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    if (!name || !message) {
      alert("Please enter both name and message!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contract_address, contract_abi, signer);

      const tx = await contract.buyCoffee(name, message, { value: ethers.parseEther("0.001") });
      setTransactionStatus("Transaction in progress...");
      await tx.wait();
      setTransactionStatus("Transaction successful");
      setTxHash(tx.hash);
      console.log("Transaction details:", tx);
      console.log("Transaction details:", tx.hash);
    } catch (error) {
      console.error("Error sending coffee:", error);
      setTransactionStatus("Transaction failed.");
    }
  };

  const handleSendCoffee = async () => {
    await sendCoffee();
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${bg_img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Conditionally hide content when the card is visible */}
      {!showCard && (
        <>
          <h1 className="text-8xl md:text-6xl font-extrabold text-center mb-8 text-white">
            buy me coffee.
          </h1>
          <button className="btn text-white mb-6" onClick={connect_wallet}>
            connect wallet.
          </button>
          {account && <p className="text-white text-xl mb-6">Connected: {account}</p>}
        </>
      )}

      {/* Darkened backdrop and animated card */}
      {showCard && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white p-12 rounded-lg shadow-xl w-[500px] max-w-[90%]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold mb-6 text-center">
              Love you mate for the coffee!
            </h2>

            <div className="mb-6">
              <label htmlFor="message" className="block text-lg font-medium text-gray-700">
                Enter the message here
              </label>
              <input
                type="text"
                id="message"
                className="mt-2 p-4 w-full border border-gray-300 rounded-md text-lg bg-white"
                placeholder="I'm Leo Das, Love you Rahul"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">
                Enter your name here
              </label>
              <input
                type="text"
                id="name"
                className="mt-2 p-4 w-full border border-gray-300 rounded-md text-lg bg-white"
                placeholder="Leo Das"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <button
              onClick={handleSendCoffee}
              className="btn glass bg-blue-500 text-white w-full py-3 rounded-md text-xl"
            >
              Send 0.001ETH 🎉
            </button>

            <p className="mt-4 text-center text-lg">
            {transactionStatus && (
                <span className="font-semibold">
                    {transactionStatus === "Transaction successful" ? (
                    <a
                        href={`https://sepolia.etherscan.io/tx/${txHash}`} // Replace `txHash` with the actual state variable holding the transaction hash
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-500 underline"
                    >
                        {transactionStatus}✅ Click here to view 🎉
                    </a>
                    ) : (
                    <span className="text-red-500">{transactionStatus}</span>
                    )}
                </span>
            )}
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
