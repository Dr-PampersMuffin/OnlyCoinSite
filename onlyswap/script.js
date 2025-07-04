import { ethers } from "https://cdn.ethers.io/lib/ethers-5.6.esm.min.js";

const ONLY_ADDRESS = "0xC0912c990fe376Bc74776b79BAf28456dAdDC055";
const WBNB_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
const ROUTER_ADDRESS = "0x10ED43C718714eb63d5aA57B78B54704E256024E";

const abi = [
  "function getAmountsOut(uint amountIn, address[] memory path) external view returns (uint[] memory amounts)",
  "function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable"
];

let provider;
let signer;
let router;

window.addEventListener("DOMContentLoaded", async () => {
  if (!window.ethereum) {
    alert("Please install MetaMask to use OnlySwap.");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
  router = new ethers.Contract(ROUTER_ADDRESS, abi, signer);

  // Handle Connect Wallet
  document.getElementById("connect-btn").addEventListener("click", async () => {
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      const walletAddress = accounts[0];
      document.getElementById("wallet-address").innerText = `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
    } catch (err) {
      console.error("Wallet connection error:", err);
    }
  });

  // Handle Live Price Estimate
  document.getElementById("bnb-input").addEventListener("input", async (e) => {
    const bnbValue = e.target.value;
    if (!bnbValue) return;

    try {
      const amountsOut = await router.getAmountsOut(
        ethers.utils.parseEther(bnbValue),
        [WBNB_ADDRESS, ONLY_ADDRESS]
      );
      const onlyAmount = ethers.utils.formatUnits(amountsOut[1], 18);
      document.getElementById("only-output").value = onlyAmount;
    } catch (err) {
      console.error("Live price error:", err);
      document.getElementById("only-output").value = "Error";
    }
  });

  // Handle Swap
  document.getElementById("swap-btn").addEventListener("click", async () => {
    const bnbValue = document.getElementById("bnb-input").value;
    if (!bnbValue || isNaN(bnbValue)) return alert("Enter a valid BNB amount.");

    try {
      const deadline = Math.floor(Date.now() / 1000) + 300; // 5 minutes
      const tx = await router.swapExactETHForTokensSupportingFeeOnTransferTokens(
        0, // minimum amount of tokens to receive
        [WBNB_ADDRESS, ONLY_ADDRESS],
        await signer.getAddress(),
        deadline,
        { value: ethers.utils.parseEther(bnbValue) }
      );

      await tx.wait();
      alert("Swap successful!");
    } catch (err) {
      console.error("Swap failed:", err);
      alert("Swap failed: " + err.message);
    }
  });
});
