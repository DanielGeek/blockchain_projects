import React, { useEffect, useState } from "react";
import { useAccount } from 'wagmi';


// INTERNAL IMPORT
import { Header, Footer, Loader, ICOSale } from "../Components/index";
import Admin from "../Components/Admin/Admin";
import AdminHead from "../Components/Admin/AdminHead";
import UpdateAPYModel from "../Components/Admin/UpdateAPYModel";
import Auth from "../Components/Admin/Auth";

import {
  CONTRACT_DATA,
  transferToken,
  createPool,
  sweep,
  modifyPool,
} from "../Context/index";

const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS;

const admin = () => {
  const { address } = useAccount();
  const [loader, setLoader] = useState(false);
  const [checkAdmin, setCheckAdmin] = useState(true);

  const [poolDetails, setPoolDetails] = useState();
  const [modifyPoolID, setModifyPoolID] = useState();

  const LOAD_DATA = async () => {
    if (address) {
      setLoader(true);

      if (address?.toLowerCase() == ADMIN_ADDRESS?.toLowerCase()) {
        setCheckAdmin(false);
        const data = await CONTRACT_DATA(address);
        setPoolDetails(data);
      }

      setLoader(false);
    }
  };

  useEffect(() => {
    LOAD_DATA();
  }, [address]);

  return (
    <div className="body-backgroundColor">
      <Header page={"admin"} />
      <AdminHead />
      <Admin
        poolDetails={poolDetails}
        transferToken={transferToken}
        address={address}
        setLoader={setLoader}
        createPool={createPool}
        sweep={sweep}
        setModifyPoolID={setModifyPoolID}
      />
      <Footer/>

      <UpdateAPYModel
        setLoader={setLoader}
        modifyPool={modifyPool}
        modifyPoolID={modifyPoolID}
      />
      <ICOSale setLoader={setLoader} />

      {checkAdmin && <Auth />}
      {loader && <Loader />}
    </div>
  );
};

export default admin;
