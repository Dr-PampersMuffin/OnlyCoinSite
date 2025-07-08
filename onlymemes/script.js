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
