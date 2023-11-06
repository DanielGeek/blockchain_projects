const hre = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {
    console.log("Deployment started!");

    const [deployer] = await ethers.getSigners();
    const address = await deployer.getAddress();
    console.log(`Deploying the contract with the account: ${address}`);

    const PETS_COUNT = 5;
    const PetAdoption = await hre.ethers.getContractFactory("PetAdoption");
    const contract = await PetAdoption.deploy(PETS_COUNT);

    await contract.waitForDeployment();

    console.log(`PetAdoption deployed to ${contract.target}`);

    saveContractFiles(contract);
}

function saveContractFiles(contract) {
    const contractDir = path.join(__dirname, "..", "frontend", "src", "contracts");

    if (!fs.existsSync(contractDir)) {
        fs.mkdirSync(contractDir);
    }

    fs.writeFileSync(
        path.join(contractDir, `contract-address-${network.name}.json`),
        JSON.stringify({PetAdoption: contract.target}, null, 2)
    );

    const PetAdoptionArtifac = artifacts.readArtifactSync("PetAdoption");

    fs.writeFileSync(
        path.join(contractDir, "PetAdoption.json"),
        JSON.stringify(PetAdoptionArtifac, null, 2)
    );
}

main().catch(error => {
    console.log(error);
    process.exitCode = 1;
});

// npx hardhat run scripts/deploy.js --network
// 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
// npx hardhat node