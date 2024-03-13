import './App.css';
import idl from './idl.json';
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import {
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
} from "@project-serum/anchor";
import { useEffect, useState } from 'react';
import { Buffer } from "buffer";
window.Buffer = Buffer;

const programID = new PublicKey(idl.metadata.address);
const network = clusterApiUrl("devnet");
const opts = {
  preflightCommitment: "processed",
}

const { SystemProgram } = web3;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom walle found!");
          const response = await solana.connect({
            onlyIfTrusted: true,
          });
          console.log(
            "Connected with public key:",
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom wallet");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
    if (solana) {
      const response = await solana.connect();
      console.log(
        "Connected with public key:",
        response.publicKey.toString()
      );
      setWalletAddress(response.publicKey.toString());
    }
  };

  const createCampaign = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const [campaign] = await PublicKey.findProgramAddress(
        [
          utils.bytes.utf8.encode("CAMPAIGN_DEMO"),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );
      await program.rpc.create("campaign name", "campaign description", {
        accounts: {
          campaign,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
      });
      console.log("Created a new campaign with address: ", campaign.toString());
    } catch (error) {
      console.error("Error creating campaign: ", error);
    }
  }

  const renderNotConnectedContainer = () => {
    return <button onClick={connectWallet}>Connect to Wallet</button>;
  }

  const renderConnectedContainer = () => {
    return <button onClick={createCampaign}>Create a campaign...</button>;
  }

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="App">
      {!walletAddress && renderNotConnectedContainer()}
      {walletAddress && renderConnectedContainer()}
    </div>
    );
};

export default App;
