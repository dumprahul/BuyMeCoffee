import React, { useState } from 'react';
import { ethers } from "ethers";
import { contract_abi } from '../contracts/contract_abi';
import { contract_address } from '../contracts/contract_address';

function BuyMeCoffee() {
    const { ethereum } = window;
    const [account, setAccount] = useState("");
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [transactionStatus, setTransactionStatus] = useState("");

    // Connect to MetaMask
    const connect_wallet = async () => {
        if (!ethereum) {
            alert("Metamask is not installed!");
            return;
        }
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            setAccount(accounts[0]);
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
            // Connect to the blockchain
            const provider = new ethers.BrowserProvider(ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contract_address, contract_abi, signer);

            // Call buyCoffee function
            const tx = await contract.buyCoffee(name, message, { value: ethers.parseEther("0.01") }); // Adjust the value as per your contract
            setTransactionStatus("Transaction in progress...");
            await tx.wait(); // Wait for transaction to be mined
            setTransactionStatus("Transaction successful!");
            console.log(tx);
        } catch (error) {
            console.error("Error sending coffee:", error);
            setTransactionStatus("Transaction failed.");
        }
    };

    // Handle Send Coffee Button
    const handleSendCoffee = async () => {
        await connect_wallet();
        await sendCoffee();
    };

    return (
        <div style={{ padding: '20px' }}>
            <button onClick={connect_wallet} style={{ marginBottom: '10px' }}>
                Connect MetaMask
            </button>
            <p>{account ? `Connected: ${account}` : "Not Connected"}</p>

            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ marginRight: '10px', padding: '5px', width: '200px' }}
                />
                <input
                    type="text"
                    placeholder="Enter Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ padding: '5px', width: '200px' }}
                />
            </div>

            <button onClick={handleSendCoffee} style={{ marginTop: '10px', padding: '10px 20px', cursor: 'pointer' }}>
                Send Coffee
            </button>

            <p>{transactionStatus}</p>
        </div>
    );
}

export default BuyMeCoffee;
