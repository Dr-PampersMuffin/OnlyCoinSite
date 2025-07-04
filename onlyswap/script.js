import { ethers } from "https://cdn.ethers.io/lib/ethers-5.6.esm.min.js";

const ONLY_ADDRESS = "0xC0912c990fe376Bc74776b79BAf28456dAdDC055";
const WBNB_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
const ROUTER_ADDRESS = "0x10ED43C718714eb63d5aA57B78B54704E256024E";

const abi = [
  "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)"
];

let provider;
let signer;
let router;

window.addEventListener("DOMContentLoaded", async () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    router = new ethers.Contract(ROUTER_ADDRESS, abi, provider);

    document.getElementById("connect-btn").addEventListener("click", async () => {
      try {
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        const address = await signer.getAddress();
        document.getElementById("wallet-address").innerText = address;
      } catch (err) {
        console.error("Wallet connect error:", err);
      }
    });

    document.getElementById("bnb-input").addEventListener("input", async (e) => {
      const bnbAmount = e.target.value;
      if (!bnbAmount || !provider) return;
      const path = [WBNB_ADDRESS, ONLY_ADDRESS];
      try {
        const amountsOut = await router.getAmountsOut(
          ethers.utils.parseEther(bnbAmount),
          path
        );
        const onlyAmount = ethers.utils.formatUnits(amountsOut[1], 18);
        document.getElementById("only-output").value = onlyAmount;
      } catch (err) {
        console.error("Error getting amounts:", err);
        document.getElementById("only-output").value = "Error";
      }
    });

    document.getElementById("swap-btn").addEventListener("click", async () => {
      if (!signer) return alert("Please connect your wallet first.");
      const bnbAmount = document.getElementById("bnb-input").value;
      if (!bnbAmount) return alert("Enter BNB amount.");
      const path = [WBNB_ADDRESS, ONLY_ADDRESS];
      const deadline = Math.floor(Date.now() / 1000) + 60 * 5;
      try {
        const connectedRouter = router.connect(signer);
        const tx = await connectedRouter.swapExactETHForTokens(
          0,
          path,
          await signer.getAddress(),
          deadline,
          { value: ethers.utils.parseEther(bnbAmount) }
        );
        await tx.wait();
        alert("Swap successful!");
      } catch (err) {
        console.error("Swap error:", err);
        alert("Swap failed: " + err.message);
      }
    });
  } else {
    alert("MetaMask not detected. Please install MetaMask.");
  }
});
