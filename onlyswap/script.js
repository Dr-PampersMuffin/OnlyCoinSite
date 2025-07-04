let provider, signer;

window.onload = async () => {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);

    document.getElementById('connectButton').onclick = async () => {
      await provider.send("eth_requestAccounts", []);
      signer = await provider.getSigner();
      alert("Wallet connected: " + await signer.getAddress());
    };

    document.getElementById('swapButton').onclick = async () => {
      const bnbAmount = document.getElementById("bnbAmount").value;
      if (!signer) return alert("Connect wallet first.");
      if (!bnbAmount || isNaN(bnbAmount)) return alert("Enter valid BNB amount.");
      alert("This is a placeholder for swap logic. Coming soon!");
    };
  } else {
    alert("MetaMask not found. Please install MetaMask.");
  }
};