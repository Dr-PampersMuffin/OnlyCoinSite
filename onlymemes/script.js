const CONTRACT_ADDRESS = "0xc8552865ddB859e67C0317D5e8AfbAc17335d30B";

const ABI = [
  "function mintNFT(string memory tokenURI) public",
  "function getRequiredOnlyCoinAmount() public view returns (uint256)",
  "function updateOnlyCoinPriceUSD(uint256 _priceMicroUSD) public"
];

let provider;
let signer;
let contract;

window.addEventListener("DOMContentLoaded", async () => {
  const connectBtn = document.getElementById("connectWallet");
  const mintBtn = document.getElementById("mintBtn");

  // Log MetaMask presence
  if (typeof window.ethereum === "undefined") {
    alert("MetaMask is not installed. Please install it to use this DApp.");
    return;
  } else {
    console.log("MetaMask detected ✅");
  }

  provider = new ethers.providers.Web3Provider(window.ethereum, "any");

  // Prompt connection on page load
  try {
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    const addr = await signer.getAddress();
    connectBtn.innerText = `Connected: ${addr.slice(0, 6)}...${addr.slice(-4)}`;
    connectBtn.disabled = true;

    // Optional: switch to Ethereum mainnet
    try {
      await provider.send("wallet_switchEthereumChain", [{ chainId: "0x1" }]);
      console.log("Network is Ethereum Mainnet");
    } catch (switchErr) {
      console.warn("Network switch failed or rejected by user");
    }

  } catch (err) {
    console.error("Auto-connect failed:", err);
    alert("Please connect your wallet using the button.");
  }

  // Manual connect button (if auto-connect fails)
  connectBtn.addEventListener("click", async () => {
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const addr = await signer.getAddress();
      connectBtn.innerText = `Connected: ${addr.slice(0, 6)}...${addr.slice(-4)}`;
      connectBtn.disabled = true;
      console.log("Wallet manually connected:", addr);
    } catch (err) {
      console.error("Manual connect error:", err);
      alert("Connection failed. Please try again.");
    }
  });

  mintBtn.addEventListener("click", async () => {
    const tokenInput = document.getElementById("tokenURI");
    const uri = tokenInput.value.trim();

    if (!uri) return alert("Please enter a token URI");
    if (!contract) return alert("Connect your wallet before minting");

    try {
      const tx = await contract.mintNFT(uri);
      console.log("Transaction sent:", tx.hash);
      await tx.wait();
      alert("🎉 NFT Minted Successfully!");
    } catch (err) {
      console.error("Minting error:", err);
      alert("Minting failed. Check console for details.");
    }
  });
});
