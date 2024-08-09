const deployedAddresses = require('../deployments/chain-31337/deployed_addresses.json');
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const NftMarketplaceModule = buildModule("NftMarketplaceModule", (m) => {

    const NftMarketplace = m.contract("NftMarketplace", [deployedAddresses['MintNftModule#MintNft']]);

    return { NftMarketplace };
});

module.exports = NftMarketplaceModule;