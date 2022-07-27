import Link from "next/link";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import CreatePlant from "./create-plant";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { plantfactoryaddress } from "../config";
import IconButton from "@mui/material/IconButton";
import Plant from "../artifacts/contracts/Plant.sol/Plant.json";
import { _nameprepTableA1 } from "@ethersproject/strings/lib/idna";
import PlantFactory from "../artifacts/contracts/PlantFactory.sol/PlantFactory.json";

export default function MyPlants() {
  const [open, setOpen] = useState(false);
  const [plants, setPlants] = useState([]);
  const [plantAddresses, setPlantAddresses] = useState([]);
  const [plantsLoaded, setPlantsLoaded] = useState("not-loaded");
  const [plantsAddressesLoaded, setPlantsAddressesLoaded] =
    useState("not-loaded");

  useEffect(() => {
    loadPlantsAddresses();
    if (plantAddresses) {
      loadPlants();
    }
  }, [plantsAddressesLoaded]);

  // Dialog Open & Close handles
  const handleClickOpen = () => {
    setOpen(true);
  };

  async function loadPlantsAddresses() {
    setPlantsAddressesLoaded("not-loaded");
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let factoryContract = new ethers.Contract(
      plantfactoryaddress,
      PlantFactory.abi,
      signer
    );
    try {
      let addresses = await factoryContract.getCollections();
      setPlantAddresses(addresses);
      setPlantsAddressesLoaded("loaded");
    } catch (err) {
      console.log(err);
    }
  }

  async function loadPlants() {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const items = await Promise.all(
      plantAddresses.map(async (i) => {
        let plantContract = new ethers.Contract(i, Plant.abi, signer);
        let name = await plantContract.name();
        let symbol = await plantContract.symbol();
        let species = await plantContract.species();

        let item = {
          contractAddress: i,
          name,
          symbol,
          species,
        };
        return item;
      })
    );
    setPlants(items);
    setPlantsLoaded("loaded");
  }

  if (plantsLoaded === "loaded" && !plants.length)
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        <IconButton
          className="border-dashed cursor-pointer hover:bg-gray-200 border-2 shadow rounded-xl flex items-center justify-center"
          onClick={handleClickOpen}
        >
          <AddIcon sx={{ fontSize: 80 }} color="action" />
        </IconButton>
        <div>{open ? <CreatePlant /> : null}</div>
      </div>
    );

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {plants.map((plant, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <Link href={"/plants/" + plant.contractAddress}>
                <div className="p-6 cursor-pointer hover:bg-sky-100">
                  <img src="IMG_20210706_151653.jpg" className="rounded-xl" />
                  <h2 className="text-2xl font-bold text-black pt-2">
                    {plant.name}
                  </h2>
                  <p className="text-gray-500">{plant.species}</p>
                </div>
              </Link>
            </div>
          ))}
          <IconButton
            className="border-dashed cursor-pointer hover:bg-gray-200 border-2 shadow rounded-xl flex items-center justify-center"
            onClick={handleClickOpen}
          >
            <AddIcon sx={{ fontSize: 80 }} color="action" />
          </IconButton>
        </div>
        <div>{open ? <CreatePlant /> : null}</div>
      </div>
    </div>
  );
}
