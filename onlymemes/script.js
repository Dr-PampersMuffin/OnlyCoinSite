const CONTRACT_ADDRESS = "0x89c2E429361089FD86fF4f96001c5Bb53E364695";

const ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_onlyCoinAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_priceFeedAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "tokenURI",
				"type": "string"
			}
		],
		"name": "Minted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "newPrice",
				"type": "uint256"
			}
		],
		"name": "PriceUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLatestPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMintCost",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_uri",
				"type": "string"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "mintCostInUSD",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextTokenId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "onlyCoinAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "priceFeedAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newPriceFeedAddress",
				"type": "address"
			}
		],
		"name": "updatePriceFeedAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

let provider, signer, contract;

window.addEventListener("DOMContentLoaded", () => {
  const connectBtn = document.getElementById("connectWallet");
  const mintBtn = document.getElementById("mintBtn");
  const priceDisplay = document.getElementById("priceDisplay");

  if (!window.ethereum) {
    alert("🦊 MetaMask not detected. Please install it.");
    connectBtn.disabled = true;
    mintBtn.disabled = true;
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum, "any");

  connectBtn.addEventListener("click", async () => {
    try {
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const address = await signer.getAddress();

      connectBtn.textContent = `Connected: ${address.slice(0,6)}...${address.slice(-4)}`;
      connectBtn.disabled = true;

      const amountNeeded = await contract.getMintCost();
      priceDisplay.textContent = `Mint costs: ${ethers.utils.formatUnits(amountNeeded, 18)} ONLY (~$10)`;

      const network = await provider.getNetwork();
      if (network.chainId !== 56) {
        try {
          await provider.send("wallet_switchEthereumChain", [{ chainId: "0x38" }]);
        } catch (switchError) {
          console.warn("⚠️ Could not switch network");
        }
      }

      console.log("✅ Wallet connected:", address);
    } catch (err) {
      console.error("❌ Connection failed:", err);
      alert("Failed to connect wallet. See console.");
    }
  });

  mintBtn.addEventListener("click", async () => {
    const uriInput = document.getElementById("tokenURI").value.trim();

    if (!uriInput) {
      alert("📸 Please enter a valid Token URI.");
      return;
    }
    if (!contract) {
      alert("🔌 Connect your wallet first.");
      return;
    }

    try {
      // Approve OnlyCoin token spend
      const onlyCoinAddr = await contract.onlyCoinAddress();
      const onlyCoin = new ethers.Contract(onlyCoinAddr, [
        "function approve(address, uint256) public returns (bool)"
      ], signer);

      const mintCost = await contract.getMintCost();
      await onlyCoin.approve(CONTRACT_ADDRESS, mintCost);
      console.log("✅ OnlyCoin approved:", mintCost.toString());

      // Actually mint the NFT
      const tx = await nftContract.mint(uri, { gasLimit: 300000 });
await tx.wait();
      console.log("🚀 Mint transaction hash:", tx.hash);
      await tx.wait();

      alert("🎉 NFT minted successfully!");
    } catch (err) {
      console.error("💥 Minting error:", err);
      alert("Minting failed. Please check console.");
    }
  });
});
