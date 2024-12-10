import React, { useState } from "react";
import { motion } from "framer-motion";
import bg_img from "../lib/pexels-codioful-7135057.jpg";
import { ethers } from "ethers";
import { contract_abi } from "../contracts/contract_abi";
import { contract_address } from "../contracts/contract_address";

export default function Memos(){

  const { ethereum } = window;

  // Connect to MetaMask

  // Send Coffee Function
  const get_Memos = async () => {
    if (!ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contract_address, contract_abi, signer);

      const all_memos = await contract.getMemos();
      console.log("The memos are:", all_memos);
    } catch (error) {
      console.error("Error sending coffee:", error);
    }
  };

  const final_memos=async() =>{
    await get_Memos();
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
              onClick={final_memos}
              className="btn glass bg-blue-500 text-white  rounded-md text-xl"
            >
              Get Memos 🎉
            </button>
    </div>
  )


};
