import React, { useState } from "react";
import { motion } from "framer-motion";
import bg_img from "../lib/pexels-codioful-7135057.jpg";
import { ethers } from "ethers";
import { contract_abi } from "../contracts/contract_abi";
import { contract_address } from "../contracts/contract_address";

export default function Withdraw(){

  const { ethereum } = window;
  const [account, setAccount] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  // Connect to MetaMask
  const connect_wallet = async () => {
    if (!ethereum) {
      alert("MetaMask is not installed!");
      return;
    }
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      console.log("Connected account:", accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Send Coffee Function
  const Withdraw = async () => {
    if (!ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contract_address, contract_abi, signer);

      const rem = await contract.withdraw();
      setTransactionStatus("Transaction in progress...");
      await rem.wait();
      setTransactionStatus("Transaction successful");
      console.log("Withdrawl Successful", rem);
    } catch (error) {
      console.error("Error sending coffee:", error);
    }
  };

  const final_withdraw= async() =>{
    await Withdraw();
  }

  return(
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage: `url(${bg_img})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
         <button
              onClick={final_withdraw}
              className="btn glass bg-blue-500 text-white  rounded-md text-xl"
            >
              Withdraw Amount to the owner 🎉
            </button>
    </div>
  )


};
