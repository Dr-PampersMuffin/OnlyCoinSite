const CONTRACT_ADDRESS = "0xc8552865ddB859e67C0317D5e8AfbAc17335d30B";

const ABI = [
  "function mintNFT(string memory tokenURI) public",
  "function getRequiredOnlyCoinAmount() public view returns (uint256)",
  "function updateOnlyCoinPriceUSD(uint256 _priceMicroUSD) public"
];

let provider;
let signer;
let contract;

window.addEventListener("load", async () => {
  const connectBtn = document.getElementById("connectWallet");
  const mintBtn = document.getElementById("mintBtn");

  connectBtn.addEventListener("click", async () => {
    if (window.ethereum) {
      try {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

        const addr = await signer.getAddress();
        connectBtn.innerText = `Connected: ${addr.slice(0, 6)}...${addr.slice(-4)}`;
        connectBtn.disabled = true;
      } catch (err) {
        alert("Wallet connection failed");
        console.error(err);
      }
    } else {
      alert("MetaMask not detected");
    }
  });

  mintBtn.addEventListener("click", async () => {
    const tokenInput = document.getElementById("tokenURI");
    const uri = tokenInput.value.trim();
    if (!uri) return alert("Please enter a token URI");

    try {
      const tx = await contract.mintNFT(uri);
      await tx.wait();
      alert("NFT Minted Successfully!");
    } catch (err) {
      alert("Minting failed");
      console.error(err);
    }
  });
});
