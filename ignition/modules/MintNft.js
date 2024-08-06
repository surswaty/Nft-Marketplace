const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const MintNftModule = buildModule("MintNftModule", (m) => {

    const MintNft = m.contract("MintNft", ["kjfakj", "fjak"]);

    return { MintNft };
});

module.exports = MintNftModule;