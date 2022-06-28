import { useEffect, useState } from 'react'
import { Contract, ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from "web3modal"

import { nftaddress, nftmarketaddress } from '../config'

import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"

export default function MyAssets () { 
    const [nfts, setNfts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')

    useEffect(() => {
        loadNfts()
    }, [])

    async function loadNfts() {
        const web3modal = new Web3Modal()
        const connection = await web3modal.connect()  
        const provider = new ethers.providers.Web3Provider(connection)
        const signer  = provider.getSigner()

        const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
        const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer)

        const data = await marketContract.fetchMyNFTs()

        const items = await Promise.all(data.map(async i => {
            const tokenURI = await tokenContract.tokenURI(i.tokenId)
            const meta  = await axios.get(tokenURI)
            let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
            let item = {
                price,
                tokenId: i.tokenId.toNumber(),
                seller: i.seller,
                owner: i.owner,
                image: meta.data.image,
            }
            return item
        }))
        setNfts(items)
        setLoadingState('loaded')
    }

    if(loadingState === 'loaded' && !nfts.length) return (
        <h1 className="px-20 py-10 text-3xl">No assets owned</h1>
    )
    
    return (
        <div className="flex justify-center">
            <div className="px-4" style={{maxWidth: '1600px'}}>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
                {
                    nfts.map((nft, i) => (
                    <div key={i} className="border shadow rounded-xl overflow-hidden">
                        <img src={nft.image} />
                        <div className='p-4'>
                        <p className="text-2xl font-bold text-black">Price - {nft.price} Eth</p>
                        <button 
                            className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded" 
                            onClick={() => listNFT(nft)}>
                            List
                        </button>
                        </div>
                    </div>
                    ))
                }
                </div>
            </div>
        </div>
        )

}