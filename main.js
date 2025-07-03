import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";

const contractAddress = "0xF0e085eD2A7C044fD93234f906CDf41e89f606d2";
const abi = [
  {
    "inputs": [],
    "name": "buyOnlyCoin",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(contractAddress, abi, signer);

document.addEventListener("DOMContentLoaded", () => {
  const buyButton = document.createElement("button");
  buyButton.innerText = "Buy OnlyCoin";
  buyButton.onclick = async () => {
    try {
      const tx = await contract.buyOnlyCoin({ value: ethers.utils.parseEther("0.01") });
      await tx.wait();
      alert("✅ Purchase successful!");
    } catch (e) {
      console.error("❌ Transaction failed:", e);
      alert("❌ Transaction failed");
    }
  };
  document.getElementById("root").appendChild(buyButton);
});