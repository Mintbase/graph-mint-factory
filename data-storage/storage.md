# Storage

## **Where is my data stored and if it's on a centralized server, what’s the point of using a blockchain?**

  
We are trying our best to build our architecture as decentralized or distributed as possible. However we need to guarantee the usability of our platform. As it stands now, the [scalability trilemma](https://medium.com/@aakash_13214/the-scalability-trilemma-in-blockchain-75fb57f646df) in blockchain is still not solved. This means that there are  tradeoffs that crypto projects must make when deciding how to optimize the underlying architecture of their own blockchain.  These are security, scalability and decentralization. If you have any feedback or want to chat about this topic, please reach out to us on [Discord](https://discordapp.com/invite/89cSHH7). 

## Current storage system

Your data right now is stored on Google Firestore when you mint a token on Mintbase. When you look at Trust Wallet or Coinbase Wallet and see your NFT, that data is not coming from our servers, they use an API created by OpenSea. OpenSea is watching \(I’m assuming\) verified contracts and contract factories that are ERC-721 compliment and duplicating the data on their own private servers where the wallets grab the data from. This is the case not only only for Mintbase, but also for other NFT platforms. 

