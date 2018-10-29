// ERC20 代币合约
const IMCToken = artifacts.require("./IMCToken.sol");
// IMC发行记录合约
const IMCIssuingRecord = artifacts.require("./IMCIssuingRecord.sol");
// IMC解锁记录合约
const IMCUnlockRecord = artifacts.require("./IMCUnlockRecord.sol");
// IMC账本记录合约
const IMCLedgerRecord = artifacts.require("./IMCLedgerRecord.sol");

// 中间帐户地址
const platformAddr = '0xbabd2f3f199397cafde680fdb272c7ea8aa85a8e';  //rinkeby（Damon）

// const platformAddr = '0xcdAcb05E9617C889faC367cCbedc36C6403cf418';  // mainnet


module.exports = function(deployer, network, accounts) {
    console.log(`Network: \x1b[36m${network}\x1b[0m`)
    console.log(`Accounts: \x1b[36m${accounts}\x1b[0m`)

    let imcToken;
    let imcIssuingRecord;

    // 发布IMCToken合约
    return deployer.deploy(IMCToken).then(() => {

        return IMCToken.deployed().then(instance => {
            imcToken = instance;
            console.log(`IMCToken deployed at \x1b[36m${instance.address}\x1b[0m`)
        });

    }).then(() => {
        // 发布IMCIssuingRecord合约
        return deployer.deploy(
            IMCIssuingRecord, imcToken.address, platformAddr
        ).then(() => {
            return IMCIssuingRecord.deployed().then(instance => {
                imcIssuingRecord = instance;
                console.log(`IMCIssuingRecord deployed at \x1b[36m${instance.address}\x1b[0m`)

                // 允许IMCIssuingRecord地址访问IMCToken合约
                imcToken.approveContractCall(instance.address);
            });
        })

    }).then(() => {

        // 发布IMCUnlockRecord合约
        return deployer.deploy(IMCUnlockRecord).then(() => {
            return IMCUnlockRecord.deployed().then(instance => {
                console.log(`IMCUnlockRecord deployed at \x1b[36m${instance.address}\x1b[0m`)
            });
        });

    }).then(() => {

        // 发布IMCLedgerRecord合约
        return deployer.deploy(IMCLedgerRecord).then(() => {
            return IMCLedgerRecord.deployed().then(instance => {
                console.log(`IMCLedgerRecord deployed at \x1b[36m${instance.address}\x1b[0m`)
            });
        });

    });

};