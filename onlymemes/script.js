
import { ethers } from "https://cdn.ethers.io/lib/ethers-5.6.esm.min.js";

const CONTRACT_ADDRESS = "0xc8552865ddB859e67C0317D5e8AfbAc17335d30B0xc8552865ddB859e67C0317D5e8AfbAc17335d30B"; // Replace with your OnlyMemesNFT contract if different
const ABI = [
  "function mintNFT(string memory tokenURI) public",
];

let provider;
let signer;
let contract;

window.addEventListener('DOMContentLoaded', async () => {
  const connectButton = document.getElementById("connect-btn");
  const mintButton = document.getElementById("mint-btn");
  const status = document.getElementById("status");

  if (typeof window.ethereum !== "undefined") {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    connectButton.addEventListener("click", async () => {
      try {
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        connectButton.innerText = "Wallet Connected";
        connectButton.disabled = true;
        status.innerText = "";
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      } catch (err) {
        status.innerText = "Wallet connection failed.";
        console.error(err);
      }
    });

    mintButton.addEventListener("click", async () => {
      if (!signer || !contract) {
        status.innerText = "Connect wallet first.";
        return;
      }
      const uri = document.getElementById("nft-uri").value.trim();
      if (!uri) {
        status.innerText = "Enter a valid IPFS URI.";
        return;
      }
      try {
        const tx = await contract.mintNFT(uri);
        status.innerText = "Minting...";
        await tx.wait();
        status.innerText = "✅ Mint successful!";
      } catch (err) {
        status.innerText = "Mint failed: " + err.message;
        console.error(err);
      }
    });
  } else {
    status.innerText = "MetaMask not detected.";
  }
});
