import React, { useEffect, useState } from "react";
import { useAccount } from 'wagmi';

// INTERNAL IMPORT
import {
  Header,
  HeroSection,
  Footer,
  Pools,
  PoolsModel,
  WIthdrawModal,
  Withdraw,
  Partners,
  Statistics,
  Token,
  Loader,
  Notification,
  ICOSale,
  Contact,
  Ask,
} from "../Components/index";

import {
  CONTRACT_DATA,
  deposit,
  withdraw,
  clainReward,
  addTokenToMetaMask,
} from "../Context/index";

const index = () => {
  return (
    <>
      <Header />
      <Footer />
    </>
  );
};

export default index;
