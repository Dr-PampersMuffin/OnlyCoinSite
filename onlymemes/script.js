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
  const tokenInput = document.getElementById("tokenURI");
  const previewImg = document.getElementById("nftPreview");
  const priceDisplay = document.getElementById("priceBox");

  // 🟡 Fetch live token price with fallback strategy
  async function fetchPrice() {
    if (!priceDisplay) return;

    // 1️⃣ DEXScreener
    try {
      const res = await fetch("https://api.dexscreener.com/latest/dex/pairs/bsc/0x342b34b131faf8846157365a31d144f8dc7d291a");
      const data = await res.json();
      const usd = parseFloat(data.pairs[0].priceUsd).toFixed(4);
      priceDisplay.innerText = `💸 OnlyCoin Price: $${usd} (via DEXScreener)`;
      return;
    } catch (err) {
      console.warn("DEXScreener failed:", err);
    }

    // 2️⃣ Mobula
    try {
      const res = await fetch("https://api.mobula.io/api/1/market/data?asset=onlycoin");
      const data = await res.json();
      const usd = parseFloat(data.price).toFixed(4);
      priceDisplay.innerText = `💸 OnlyCoin Price: $${usd} (via Mobula)`;
      return;
    } catch (err) {
      console.warn("Mobula failed:", err);
    }

    // 3️⃣ CoinGecko
    try {
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=onlycoin&vs_currencies=usd");
      const data = await res.json();
      const usd = parseFloat(data.onlycoin.usd).toFixed(4);
      priceDisplay.innerText = `💸 OnlyCoin Price: $${usd} (via CoinGecko)`;
      return;
    } catch (err) {
      console.warn("CoinGecko failed:", err);
    }

    priceDisplay.innerText = "⚠️ Price unavailable. All APIs failed.";
  }

  fetchPrice();
  setInterval(fetchPrice, 30000); // Refresh every 30 sec

  // 🖼️ Live NFT image preview
  if (tokenInput && previewImg) {
    tokenInput.addEventListener("input", () => {
      const uri = tokenInput.value.trim();
      if (uri) {
        previewImg.src = uri;
        previewImg.style.display = "block";
      } else {
        previewImg.style.display = "none";
      }
    });
  }

  // 🦊 MetaMask check
  if (!window.ethereum) {
    alert("🦊 MetaMask not detected. Please install it to connect your wallet.");
    connectBtn.disabled = true;
    mintBtn.disabled = true;
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum, "any");

  // 🔌 Connect wallet
  connectBtn.addEventListener("click", async () => {
    try {
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const address = await signer.getAddress();
      connectBtn.textContent = `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`;
      connectBtn.disabled = true;

      const amountNeeded = await contract.getRequiredOnlyCoinAmount();
      if (priceDisplay) {
        priceDisplay.innerText += ` • Mint cost: ${ethers.utils.formatUnits(amountNeeded, 18)} ONLY`;
      }

      console.log("✅ Wallet connected:", address);

      const network = await provider.getNetwork();
      if (network.chainId !== 1) {
        try {
          await provider.send("wallet_switchEthereumChain", [{ chainId: "0x1" }]);
        } catch (switchError) {
          console.warn("⚠️ Network switch declined or failed");
        }
      }

    } catch (err) {
      console.error("❌ Wallet connection failed:", err);
      alert("Failed to connect wallet. Check console for details.");
    }
  });

  // 🎨 Mint NFT
  mintBtn.addEventListener("click", async () => {
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
