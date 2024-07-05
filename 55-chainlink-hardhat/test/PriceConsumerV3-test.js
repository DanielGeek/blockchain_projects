const { expect } = require("chai");
const hre = require("hardhat");

describe("PriceConsumerV3", function () {
  let priceConsumerV3;

  beforeEach(async () => {
    const PriceConsumerV3 = await hre.ethers.getContractFactory("PriceConsumerV3");
    priceConsumerV3 = await PriceConsumerV3.deploy({ chainId: 1337 });
    await priceConsumerV3.deployed();
  });

  it("Should be able to successfully get round data", async function () {
    expect(await priceConsumerV3.getLatestPrice()).to.not.be.null;
  });
});
