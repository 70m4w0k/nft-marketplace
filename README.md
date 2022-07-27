# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
npx hardhat help
npm run dev
```

# TODO

## Utils

[x] conversion date <-> uint

[ ] look for Heroku db

[ ] add intermediate db (home server, heroku, ...)

## Create Plant

[x] Form -> droplist all species already registered

## My Plants

[x] list all plants (aka NFT Collections)
[ ] render coveringImg from NFT Collection

## Plant Tracker

[x] mintNFT()

[x] loadNFTs() : render {img + date}

[ ] nft render by date

[ ] Form -> check for url doublons

[x] Form -> datePicker

[x] Form -> add imageUploader + IPFS

[x] Form -> place in popup

[x] Form -> date extraction from fileName

[ ] Multiple uploads feature

[ ] Add calendar view (by weeks)

[ ] Add Weather (temperature, rain) day by day

[ ] Add add gardening actions (seedling, cutting, harvest, mulching)
