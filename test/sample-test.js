const { expect } = require("chai");
const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const { ethers } = require("hardhat");
const expectEvent = require('@openzeppelin/test-helpers/src/expectEvent');

// describe("NFT market", function () {
//   it("Should create and execute market sales", async function () {
//     const Market = await ethers.getContractFactory("NFTMarket")
//     const market = await Market.deploy()
//     await market.deployed()
//     const marketAddress = market.address

//     const NFT = await ethers.getContractFactory("NFT")
//     const nft = await NFT.deploy(marketAddress)
//     await nft.deployed()

//     const nftContractAddress = nft.address
//     let listingPrice = await market.getListingPrice()
//     listingPrice = listingPrice.toString()

//     const auctionPrice = ethers.utils.parseUnits('100', 'ether')

//     await nft.createToken("https://www.youtube.com/watch?v=GKJBEEXUha0")
//     await nft.createToken("https://www.youtube.com/watch?v=gyMwXuJrbJQ")
    
//     await market.createMarketItem(nftContractAddress, 1, auctionPrice, {value: listingPrice})
//     await market.createMarketItem(nftContractAddress, 2, auctionPrice, {value: listingPrice})

//     const [_, buyerAddress] = await ethers.getSigners()

//     await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, {value: auctionPrice})

//     let items = await market.fetchMarketItems()

//     items = await Promise.all(items.map(async i => {
//       const tokenUri = await nft.tokenURI(i.tokenId)
//       let item = {
//         price: i.price.toString(),
//         tokenId: i.tokenId.toString(),
//         seller: i.seller,
//         owner: i.owner,
//         tokenUri
//       }
//       return item
//     }))
    
//     console.log('items: ', items)
//   });
// });

describe("Jardin", function () {
  it("Should create sujet and add tracking pictures", async function () {
    const Jardin = await ethers.getContractFactory("Jardin")
    const jardin = await Jardin.deploy()
    await jardin.deployed()

    await jardin.createSujet("vitis vinifera", "Vigne 1")
    await jardin.createSujet("tomato keychup", "tomate rambo")

    let items = await jardin.getAllSujets()

    items = await Promise.all(items.map(async i => {
      let item = {
        id: i.id.toString(),
        name: i.name.toString(),
        species: i.species.toString()
      }
      return item
    }))

    console.log('items: ', items)

    await jardin.addPicture(1, 29062022, "https://www.youtube.com/watch?v=aUU-eHCB6j8")
    await jardin.addPicture(1, 22062022, "https://www.youtube.com/watch?v=nRMo5jjgCr4")
    await jardin.addPicture(2, 22062022, "https://stackoverflow.com/questions/49345903/copying-of-type-struct-memory-memory-to-storage-not-yet-supported  ")
    await jardin.addPicture(2, 22062022, "https://discord.com/channels/918178320682733648/940647079552897054")
    
    let tps = await jardin.getAllPictures()

    // console.log('tps: ', tps)

    tps = await Promise.all(tps.map(async i => {
      let item = {
        id: i.id.toString(),
        sujetId: i.sujetId.toString(),
        date: i.date.toString(),
        url: i.url
      }
      return item
    }))

    console.log('pictures :', tps)
  
  });
});