# DeFi Stablecoin Project | Foundry | Chainlink Oracles | wETH | wBTC


## This project is meant to be a stablecoin where users can deposit WETH and WBTC in exchange for a token that will be pegged to the USD.

Key Features:
- ERC20 Standard: This ensures that the DSC token can interact seamlessly with the Ethereum ecosystem, including exchanges, wallets, and other decentralized applications (dApps).

- Burnable: The token can be burned to reduce the circulating supply, a critical feature for managing its stable value.

- Owned by DSCEngine: The minting and burning rights are exclusively held by the DSCEngine contract, ensuring that the supply of DSC can only be modified in accordance with the system's collateralization rules and stability mechanisms.

Interaction between DSCEngine and DecentralizedStableCoin:
The DSCEngine contract acts as the operational core of the system. It manages collateral deposits, the minting and burning of DSC tokens to adjust the supply, and ensures the system remains over-collateralized to safeguard its stability and reliability.

System Purpose:
The overarching goal of this system is to provide a decentralized stablecoin (DSC) that maintains its value close to one USD, leveraging cryptocurrency collateral. The system's stability and security hinge on the strategic interaction between collateral management and monetary supply regulation through the minting and burning of DSC. This is achieved in a decentralized manner, without relying on central governance entities or complex governance mechanisms, setting it apart from other stablecoin models that may depend on centralized authorities or intricate governance frameworks.

Tech Stack and tools:
Solidity
Foundry
openzeppelin ERC20, Ownable, nonReentrant library
IPFS
USD
wETH
wBTC
Chainlink Oracles
Testing, Fuzz (Invariant) tests

### help full commands
`forge test --match-test invariant_protocolMustHaveMoreValueThanTotalSupply -vv`
