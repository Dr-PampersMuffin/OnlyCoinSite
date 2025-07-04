
import { ethers } from "https://cdn.ethers.io/lib/ethers-5.6.esm.min.js";

const ONLY = "0xC0912c990fe376Bc74776b79BAf28456dAdDC055";
const WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
const ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";

const abi = [
  "function getAmountsOut(uint amountIn, address[] memory path) view returns (uint[] memory amounts)",
  "function swapExactETHForTokensSupportingFeeOnTransferTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable"
];

let provider, signer, router;

window.addEventListener("DOMContentLoaded", async () => {
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask is not installed.");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  router = new ethers.Contract(ROUTER, abi, provider);

  document.getElementById("connect-btn").addEventListener("click", async () => {
    try {
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      const address = await signer.getAddress();
      document.getElementById("wallet-address").innerText = `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`;
    } catch (e) {
      alert("Wallet connection failed.");
    }
  });

  document.getElementById("bnb-input").addEventListener("input", async (e) => {
    const value = e.target.value;
    if (!value || !provider) return;

    try {
      const path = [WBNB, ONLY];
      const amounts = await router.getAmountsOut(ethers.utils.parseEther(value), path);
      const only = ethers.utils.formatUnits(amounts[1], 18);
      document.getElementById("only-output").value = only;
    } catch (err) {
      document.getElementById("only-output").value = "Error";
      console.error("Estimation failed:", err);
    }
  });

  document.getElementById("swap-btn").addEventListener("click", async () => {
    if (!signer) return alert("Connect wallet first.");
    const bnbValue = document.getElementById("bnb-input").value;
    if (!bnbValue) return alert("Enter BNB amount.");

    const routerWithSigner = router.connect(signer);
    const path = [WBNB, ONLY];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 5;

    try {
      const tx = await routerWithSigner.swapExactETHForTokensSupportingFeeOnTransferTokens(
        0, path, await signer.getAddress(), deadline,
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
