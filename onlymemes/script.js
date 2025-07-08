window.addEventListener("DOMContentLoaded", async () => {
  const connectBtn = document.getElementById("connectWallet");

  connectBtn.addEventListener("click", async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("Connected account:", accounts[0]);
        connectBtn.innerText = `Connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
      } catch (err) {
        console.error("Connection failed:", err);
      }
    } else {
      alert("MetaMask not found");
    }
  });
});
