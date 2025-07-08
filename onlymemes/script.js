window.addEventListener("DOMContentLoaded", () => {
  const connectButton = document.getElementById('connectWallet');

  connectButton.addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const selectedAccount = accounts[0];
        connectWallet.innerText = `Connected: ${selectedAccount.slice(0, 6)}...${selectedAccount.slice(-4)}`;
        connectWallet.disabled = true;
        console.log("Connected to:", selectedAccount);
      } catch (err) {
        console.error("User rejected the connection:", err);
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask.");
    }
  });
});
