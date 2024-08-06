const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const NftMarketplaceModule = buildModule("NftMarketplaceModule", (m) => {

    const NftMarketplace = m.contract("NftMarketplace", ["0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"]);

    return { NftMarketplace };
});

module.exports = NftMarketplaceModule;