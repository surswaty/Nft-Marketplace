import React, { useState, useRef } from 'react';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import TextField from '@mui/material/TextField';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Stack from '@mui/material/Stack';
import { Contract, ethers } from 'ethers';
import { Result } from 'postcss';
import { parse } from '@ethersproject/transactions';
const mintNftJson = require('./data/MintNft.json');
const nftMarketpaceJson = require('./data/NftMarketplace.json');
const deployedAddresses = require('./data/deployed_addresses.json');
const nftBg = require('./stock/nft-bg.jpg');




function App() {
  // {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  //   provider.on("network", (newNetwork, oldNetwork) => {
  //     if (oldNetwork) {
  //       window.location.reload();
  //     }
  //   });
  // }

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [mintNftCon, setMintNftCon] = useState(null);
  const [mintNftCon_rw, setMintNftCon_rw] = useState(null);
  const [nftMarketpaceCon, setnftMarketpaceCon] = useState(null);
  const [nftMarketpaceCon_rw, setNftMarketpaceCon_rw] = useState(null);

  const [mintTokenId, setMintTokenId] = useState();
  const [nftContractAddress, setNftContractAddress] = useState();
  const [tokenId, setTokenId] = useState();
  const [price, setPrice] = useState(null);
  // const [showSuccessAlert, setShowSucessAlert] = useState(false);
  const [alertLocation, setAlertLocation] = useState('');
  const [alertText, setAlertText] = useState("");
  const [approveTokenId, setApproveTokenId] = useState(null);
  const [listTokenId, setListTokenId] = useState(null);

  // const nftContractAddress = useRef();
  // const tokenId = useRef();
  // const price = useRef();

  const mintNftAddress = deployedAddresses['MintNftModule#MintNft'];
  const mintNftAbi = mintNftJson.abi;
  const nftMarketpaceAddr = deployedAddresses['NftMarketplaceModule#NftMarketplace'];
  const nftMarketpalaceAbi = nftMarketpaceJson.abi;

  const connectToWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();

      const address = await signer.getAddress();

      const mintNft = new ethers.Contract(mintNftAddress, mintNftAbi, provider);
      const mintNft_rw = new ethers.Contract(mintNftAddress, mintNftAbi, signer);

      const nftMarketpace = new ethers.Contract(nftMarketpaceAddr, nftMarketpalaceAbi, provider);
      const nftMarketpace_rw = new ethers.Contract(nftMarketpaceAddr, nftMarketpalaceAbi, signer);

      setProvider(provider);
      setSigner(signer);
      setAddress(address);
      setMintNftCon(mintNft);
      setMintNftCon_rw(mintNft_rw);
      setnftMarketpaceCon(nftMarketpace);
      setNftMarketpaceCon_rw(nftMarketpace_rw);

      // const result = await mintNft_rw.checkBalance();
      // const data = ethers.utils.formatEther(result._hex);
      // console.log('Result:', data);
      // setBalance(data);

      console.log('Wallet connected');
    } catch (error) {
      console.log(error)
    }
  };

  const mint = async () => {
    if (provider !== null) {
      // const network = await provider.getNetwork();
      // if (network.name !== 'goerli') {
      //   alert(`Please change wallet to "goerli" chain first`);
      // } else {
      try {
        const tx = await mintNftCon_rw.mint(mintTokenId);
        console.log('Result:', tx);
        setAlertText("Mint Successful");
        setAlertLocation('mint');
        setTimeout(() => {
          setAlertLocation('')
        }, 5000);
      } catch (err) {
        console.error("Error:", err);
      }
      // }
    } else {
      alert(`Please connect the "wallet" first`);
    }
  }

  const approve = async () => {
    if (provider !== null) {
      //   const network = await provider.getNetwork();
      //   if (network.name !== 'goerli') {
      //     alert(`Please change wallet to "goerli" chain first`);
      // } else {
      try {
        const tx = await mintNftCon_rw.approve(nftMarketpaceAddr, approveTokenId);
        await tx.wait();
        console.log("tx:", tx);
        setAlertText("Approve Successful");
        setAlertLocation('approve');
        setTimeout(() => {
          setAlertLocation('')
        }, 5000);
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      alert(`Please connect the "wallet" first`);
    }
  };

  const list = async () => {
    if (provider !== null) {
      //   const network = await provider.getNetwork();
      //   if (network.name !== 'goerli') {
      //     alert(`Please change wallet to "goerli" chain first`);
      // } else {
      try {
        const tx = await nftMarketpaceCon_rw.list(mintNftAddress, listTokenId, price);
        console.log("tx:", tx);
        setAlertText("List Successful");
        setAlertLocation('list');
        setTimeout(() => {
          setAlertLocation('');
        }, 5000);
      } catch (err) {
        console.error("Error:", err);
      }
    } else {
      alert(`Please connect the "wallet" first`);
    }
  };

  const handleMintTokenId = (event) => {
    setMintTokenId(event.target.value); // Update the state with the new input value
  };
  const HandleApproveTokenId = (event) => {
    setApproveTokenId(event.target.value); // Update the state with the new input value
  };
  const handleListTokenId = (event) => {
    setListTokenId(event.target.value); // Update the state with the new input value
  };
  const handleNftAddress = (event) => {
    setNftContractAddress(event.target.value); // Update the state with the new input value
  };
  const handlePrice = (event) => {
    setPrice(event.target.value); // Update the state with the new input value
  };

  function ButtonAppBar() {
    return (
      <div className="">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar className="">
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                NFT Marketplace
              </Typography>
              <Button color="inherit" onClick={connectToWallet}>{provider && signer ? `Wallet Connected` : `Connet Wallet`}</Button>
            </Toolbar>
          </AppBar>
        </Box>
      </div>
    );
  }



  return (

    <div className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${nftBg})` }}
    >

      <ButtonAppBar />

      <div className='flex flex-col mt-32 ml-32 space-y-14 flex-wrap'>
        <div className="bg-white p-4 flex rounded-lg w-96 flex-col space-y-3">
          <div className="text-black text-2xl flex" >
            <h2 className='flex-none'>Mint NFT</h2>
            <div className='flex-none mx-4'>
              {
                alertLocation == 'mint' ?
                  <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                    {alertText}
                  </Alert> :
                  null
              }
            </div>
          </div>
          <div >
            <TextField type='number' value={mintTokenId} onChange={handleMintTokenId} id="outlined-basic" label="Token ID" variant="outlined" />
          </div>
          <div>
            <Button type='submit' onClick={mint} variant="contained" >Mint</Button>
          </div>
        </div >
        <div className="bg-white p-4 flex rounded-lg w-96 flex-col space-y-3">
          <div className="text-black text-2xl flex" >
            <h2 className='flex-none'>Approve NFT</h2>
            <div className='flex-none mx-4'>
              {
                alertLocation == 'approve' ?
                  <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                    {alertText}
                  </Alert> :
                  null
              }
            </div>
          </div>
          <div >
            <TextField type='number' value={approveTokenId} onChange={HandleApproveTokenId} id="outlined-basic" label="Token ID" variant="outlined" />
          </div>
          <div>
            <Button type='submit' onClick={approve} variant="contained" >Approve</Button>
          </div>
        </div >

        <div className="bg-white p-5 flex rounded-lg w-96 flex-col space-y-3">
          <div className="text-black text-2xl flex" >
            <h2 className='flex-none'>List NFT</h2>
            <div className='flex-none mx-4'>
              {
                alertLocation == "list" ?
                  <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                    {alertText}
                  </Alert> :
                  null
              }
            </div>
          </div>
          <div>
            <TextField type='number' value={listTokenId} onChange={handleListTokenId} id="outlined-basic" label="Token ID" variant="outlined" />
          </div>
          <div>
            <TextField type='number' value={price} onChange={handlePrice} id="outlined-basic" label="Price" variant="outlined" />
          </div>
          <div>
            <Button type='submit' onClick={list} variant="contained" >List</Button>
          </div>
        </div>

      </div>

    </div >

  );
}

export default App;
