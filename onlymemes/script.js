const CONTRACT_ADDRESS = "0xc8552865ddB859e67C0317D5e8AfbAc17335d30B";

const ABI = [
  "function mintNFT(string memory tokenURI) public",
  "function getRequiredOnlyCoinAmount() public view returns (uint256)",
  "function updateOnlyCoinPriceUSD(uint256 _priceMicroUSD) public"
];

let provider;
let signer;
let contract;

window.addEventListener("DOMContentLoaded", () => {
  const connectBtn = document.getElementById("connectWallet");
  const mintBtn = document.getElementById("mintBtn");

  // Check MetaMask availability
  if (!window.ethereum) {
    alert("🦊 MetaMask not detected. Please install it to connect your wallet.");
    connectBtn.disabled = true;
    mintBtn.disabled = true;
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum, "any");

  connectBtn.addEventListener("click", async () => {
    try {
      // Request account access
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const address = await signer.getAddress();
      connectBtn.textContent = `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`;
      connectBtn.disabled = true;
      const amountNeeded = await contract.getRequiredOnlyCoinAmount();
      priceDisplay.innerText = `Minting costs ~${ethers.utils.formatUnits(amountNeeded, 18)} ONLY (~$10)`;

      console.log("✅ Wallet connected:", address);

      // Optional: Check network and suggest switching
      const network = await provider.getNetwork();
      if (network.chainId !== 1) {
        try {
          await provider.send("wallet_switchEthereumChain", [{ chainId: "0x1" }]); // Ethereum Mainnet
        } catch (switchError) {
          console.warn("⚠️ Network switch declined or failed");
        }
      }

    } catch (err) {
      console.error("❌ Wallet connection failed:", err);
      alert("Failed to connect wallet. Check console for details.");
    }
  });

  mintBtn.addEventListener("click", async () => {
    const tokenInput = document.getElementById("tokenURI");
    const uri = tokenInput.value.trim();

    if (!uri) {
      alert("📸 Please enter a valid token URI.");
      return;
    }

    if (!contract) {
      alert("🔌 Connect your wallet before minting.");
      return;
    }

    try {
      const tx = await contract.mintNFT(uri);
      console.log("🚀 Transaction sent:", tx.hash);
      await tx.wait();
      alert("🎉 NFT Minted Successfully!");
    } catch (err) {
      console.error("💥 Minting failed:", err);
      alert("Minting failed. See console for more info.");
    }
  });
});
