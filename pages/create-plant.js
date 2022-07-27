import { ethers } from "ethers";
import { useState } from "react";
import Web3Modal from "web3modal";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { plantfactoryaddress } from "../config";
import { species } from "../public/species/species.js";
import PlantFactory from "../artifacts/contracts/PlantFactory.sol/PlantFactory.json";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";

export default function CreatePlant() {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(true);
  const [specie, setSpecie] = useState("");
  const [symbol, setSymbol] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    setSpecie(event.target.value);
  };

  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleChangeSymbol = (event) => {
    setSymbol(event.target.value);
  };

  async function createSujet() {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(
      plantfactoryaddress,
      PlantFactory.abi,
      signer
    );
    let transaction = await contract.createPlant(name, symbol, specie);
    let tx = await transaction.wait();

    let event = tx.events[0];
    console.log("CREATE_SUJET_EVENT", event);
    setOpen(false);
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Plant</DialogTitle>
      <DialogContent>
        <DialogContentText> hello</DialogContentText>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <div className="flex justify-center mt-2">
            <TextField
              id="outlined-select-species"
              select
              required
              label="Species"
              value={specie}
              onChange={handleChange}
            >
              {species.map((option) => (
                <MenuItem key={option.value} value={option.label}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="flex justify-center mt-2">
            <TextField
              required
              id="outlined-name-required"
              label="Name"
              onChange={handleChangeName}
              inputProps={{
                style: { textAlign: "center", height: "40px" },
              }}
            />
          </div>
          <div className="flex justify-center mt-2">
            <TextField
              required
              id="outlined-symbol-required"
              label="Symbol"
              onChange={handleChangeSymbol}
              inputProps={{
                style: { textAlign: "center", height: "40px" },
              }}
            />
          </div>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" component="label" onClick={createSujet}>
          Add Plant
        </Button>
      </DialogActions>
    </Dialog>
  );
}
