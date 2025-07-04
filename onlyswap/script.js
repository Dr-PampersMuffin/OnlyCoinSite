const ONLY_ADDRESS = "0xC0912c990fe376Bc74776b79BAf28456dAdDC055";
const WBNB_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
const ROUTER_ADDRESS = "0x10ED43C718714eb63d5aA57B78B54704E256024E";

const abi = [
  "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)"
];

let provider, signer, router;

window.addEventListener("DOMContentLoaded", () => {
  if (!window.ethereum) {
    alert("MetaMask not detected.");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  router = new ethers.Contract(ROUTER_ADDRESS, abi, provider);

  document.getElementById("connect-btn").addEventListener("click", connectWallet);
  document.getElementById("bnb-input").addEventListener("input", updateOnlyEstimate);
  document.getElementById("swap-btn").addEventListener("click", executeSwap);
});

async function connectWallet() {
  try {
    const accounts = await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    const address = await signer.getAddress();
    document.getElementById("wallet-address").innerText =
      `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`;
    document.getElementById("connect-btn").disabled = true;
  } catch (err) {
    console.error("Wallet connection error:", err);
  }
}

async function updateOnlyEstimate(e) {
  const bnbAmount = e.target.value;
  if (!bnbAmount || isNaN(bnbAmount) || parseFloat(bnbAmount) <= 0) {
    document.getElementById("only-output").value = "";
    return;
  }

  const path = [WBNB_ADDRESS, ONLY_ADDRESS];
  try {
    const amountsOut = await router.getAmountsOut(ethers.utils.parseEther(bnbAmount), path);
    const onlyAmount = ethers.utils.formatUnits(amountsOut[1], 18);
    document.getElementById("only-output").value = onlyAmount;
  } catch (err) {
    console.error("Price fetch error:", err);
    document.getElementById("only-output").value = "Error";
  }
}

async function executeSwap() {
  if (!signer) return alert("Connect your wallet first.");
  const bnbAmount = document.getElementById("bnb-input").value;
  if (!bnbAmount || isNaN(bnbAmount) || parseFloat(bnbAmount) <= 0) return alert("Enter a valid BNB amount.");

  const path = [WBNB_ADDRESS, ONLY_ADDRESS];
  const deadline = Math.floor(Date.now() / 1000) + 300;

  try {
    const connectedRouter = router.connect(signer);
    const amountsOut = await connectedRouter.getAmountsOut(ethers.utils.parseEther(bnbAmount), path);
    const expectedOut = amountsOut[1];
    const slippageTolerance = 0.02;
    const amountOutMin = expectedOut.sub(expectedOut.mul(slippageTolerance * 100).div(100));

    const tx = await connectedRouter.swapExactETHForTokens(
      amountOutMin,
      path,
      await signer.getAddress(),
      deadline,
      { value: ethers.utils.parseEther(bnbAmount) }
    );
    await tx.wait();
    alert(`Swap successful!\nView on BscScan:\nhttps://bscscan.com/tx/${tx.hash}`);
  } catch (err) {
    console.error("Swap failed:", err);
    alert("Swap failed: " + err.message);
  }
}
