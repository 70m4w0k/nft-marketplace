import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { Contract, ethers } from "ethers";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { TrackerList } from "../components/TrackerList";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { create as ipfsHttpClient } from "ipfs-http-client";
import CircularProgress from "@mui/material/CircularProgress";
import Plant from "../../artifacts/contracts/Plant.sol/Plant.json";
import { _nameprepTableA1 } from "@ethersproject/strings/lib/idna";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export default function Details() {
  const [plant, setPlant] = useState([]);
  const [open, setOpen] = useState(false);
  const [fileUrl, setFileUrl] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [picturesLoaded, setPicturesLoaded] = useState("not-loaded");
  const [formInput, updateFormInput] = useState({
    url: "",
    date: "",
  });

  const { asPath } = useRouter();
  const plantAddress = asPath.split("/")[2];

  useEffect(() => {
    loadPlant();
    loadPictures();
  }, []);

  // Dialog Open & Close handles
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Date converter unix -> dd/mm/yyyy
  function convertDate(inputFormat) {
    function pad(s) {
      return s < 10 ? "0" + s : s;
    }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("/");
  }

  // Pre-fill date form input
  function extractDateFromFileName(file) {
    let year = file.name.substring(4, 8);
    let month = file.name.substring(8, 10);
    let day = file.name.substring(10, 12);

    return [year, month, day].join("-");
  }

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      setUploadingImg(true);
      const added = await client.add(file, {
        progress: (prog) => {
          console.log(`received: $(prog)`);
        },
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
      let newDate = extractDateFromFileName(file);
      updateFormInput({ ...formInput, url, date: newDate });
      setUploadingImg(false);
    } catch (err) {
      console.log(err);
    }
  }

  // Get the contract global variables
  async function loadPlant() {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let plantContract = new ethers.Contract(plantAddress, Plant.abi, signer);

    let name = await plantContract.name();
    let symbol = await plantContract.symbol();
    let species = await plantContract.species();

    let item = {
      name,
      symbol,
      species,
    };
    setPlant(item);
  }

  // Get all the NFT for the given collection
  async function loadPictures() {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let plantContract = new ethers.Contract(plantAddress, Plant.abi, signer);

    let pics = [];

    setPictures(pics);

    let lastTokenId = await plantContract.lastTokenId();
    for (let i = 0; i < lastTokenId; i++) {
      const unixDate = await plantContract.items(i);
      const picUrl = await plantContract.tokenURI(i + 1);

      // Convert date from unix time to 'dd-mm-yyyy'
      const date = new Date(unixDate * 1000);
      const dateToRender = convertDate(date);

      let pic = {
        date: dateToRender,
        picUrl,
      };
      pics.push(pic);
    }
    setPictures(pics);
    setPicturesLoaded("loaded");
  }

  async function MintNFT() {
    const { url, date } = formInput;

    if (!url || !date) return;
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let plantContract = new ethers.Contract(plantAddress, Plant.abi, signer);

    // Convert date from 'dd-mm-yyyy' to unix time (milliseconds count since 1970)
    let unixDate = Math.floor(new Date(date)) / 1000;

    // let newDate = new Date(unixDate * 1000);

    let transaction = await plantContract.MintNFT(url, unixDate);
    let tx = await transaction.wait();

    setOpen(false);
    setPicturesLoaded("not-loaded");
    setFileUrl([]);
    loadPictures();
  }

  if (picturesLoaded === "not-loaded")
    return <h1 className="px-20 py-10 text-3xl">Loading pics ...</h1>;

  return (
    <div className="flew-col">
      {/* Plant Contract Header */}
      <div className="flex justify-center">
        <div className="w-1/2 flex flex-col pb-12">
          <h2 className="text-2xl font-bold text-black pt-2">
            {plant.name} - {pictures.length} track(s)
          </h2>
          <p className="text-gray-700">{plant.species}</p>
          <p className="text-gray-500">{plantAddress}</p>
        </div>
      </div>
      {/* NFT Creation Form */}
      <div className="flex justify-center">
        <div>
          <Button
            variant="contained"
            component="label"
            endIcon={<PhotoCamera />}
            onClick={handleClickOpen}
          >
            New Track
          </Button>
        </div>
      </div>
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Track</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a date and a link for the tracking
            </DialogContentText>
            <div className="grid grid-cols-2 gap-6 mt-8">
              <label className="block">
                <span className="text-gray-700">URL</span>
                <input
                  type="text"
                  className="
                    mt-1
                    mb-4
                    block
                    w-full
                    rounded-md
                    bg-gray-100
                    border-transparent
                    focus:border-gray-500 focus:bg-white focus:ring-0
                  "
                  value={fileUrl}
                  onChange={(e) =>
                    updateFormInput({ ...formInput, url: e.target.value })
                  }
                />
              </label>
              <label className="block">
                <span className="text-gray-700">OR</span>
                <input
                  type="file"
                  title=" "
                  className="mt-4
                    block
                    w-full
                    text-transparent
                    "
                  onChange={onChange}
                />
              </label>
            </div>
            <div className="flex mt-1 justify-center">
              {uploadingImg && <CircularProgress />}
              {fileUrl && <img className="rounded" width="350" src={fileUrl} />}
            </div>
            <div className="grid grid-cols-1 gap-6 mt-1">
              <label className="block">
                <span className="text-gray-700">Date</span>
                <input
                  type="date"
                  className="
                    mt-1
                    block
                    w-full
                    rounded-md
                    bg-gray-100
                    border-transparent
                    focus:border-gray-500 focus:bg-white focus:ring-0
                  "
                  value={formInput.date}
                  onChange={(e) =>
                    updateFormInput({
                      ...formInput,
                      date: e.target.value,
                    })
                  }
                />
              </label>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={MintNFT}>Add Track</Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* List of all NFTs */}
      <div className="flex justify-center">
        <TrackerList pictures={pictures}></TrackerList>
      </div>
    </div>
  );
}
