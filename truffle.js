/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

require('dotenv').config();

const Web3 = require("web3");
const web3 = new Web3();
const WalletProvider = require("truffle-wallet-provider");
const Wallet = require('ethereumjs-wallet');

const HDWalletProvider = require("truffle-hdwallet-provider"); 


/**
 * PrivateKey Mode
 */

// // ropsten 测试网络
// var ropstenPrivateKey = new Buffer(process.env["ROPSTEN_PRIVATE_KEY"], "hex")
// var ropstenWallet = Wallet.fromPrivateKey(ropstenPrivateKey);
// var ropstenProvider = new WalletProvider(ropstenWallet, "https://ropsten.infura.io/");

// // rinkeby 测试网络
// var rinkebyPrivateKey = new Buffer(process.env["RINKEBY_PRIVATE_KEY"], "hex")
// var rinkebyWallet = Wallet.fromPrivateKey(rinkebyPrivateKey);
// var rinkebyProvider = new WalletProvider(rinkebyWallet, "https://rinkeby.infura.io/");



/**
 * KeyStore Mode
 */

// ropsten 测试网络（Read and unlock keystore）
var ropstenKeystore = require('fs').readFileSync('./keystore/ropsten.json').toString();
var ropstenWallet = Wallet.fromV3(ropstenKeystore, process.env["ROPSTEN_PASSWORD"]);
var ropstenProvider = new WalletProvider(ropstenWallet, "https://ropsten.infura.io/ea484435024c49c6b90816aef8a5d456");

// rinkeby 测试网络（Read and unlock keystore）
var rinkebyKeystore = require('fs').readFileSync('./keystore/rinkeby.json').toString();
var rinkebyWallet = Wallet.fromV3(rinkebyKeystore, process.env["RINKEBY_PASSWORD"]);
var rinkebyProvider = new WalletProvider(rinkebyWallet, "https://rinkeby.infura.io/ea484435024c49c6b90816aef8a5d456");

// mainnet 主网络（Read and unlock keystore）
var mainnetKeystore = require('fs').readFileSync('./keystore/mainnet.json').toString();
var mainnetWallet = Wallet.fromV3(mainnetKeystore, process.env["MAINNET_PASSWORD"]);
var mainnetProvider = new WalletProvider(mainnetWallet, "https://mainnet.infura.io/ea484435024c49c6b90816aef8a5d456");


var mnemonic =  "ten dry senior side hammer stomach celery confirm dwarf fossil strike depend";


module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    // Ganache CLI 命令行
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // 匹配任何network id
    },
    // Ganache GUI 客户端
    test: {
      host: "localhost",
      port: 7545,
      from: '0x4C8C7d9eC3Fb9f201A079BA9bF6fA0EC93d8342C', // 如果不指定默认客户端第一个账号
      network_id: "*" // 匹配任何network id
    },
    // ropsten - 测试网络
    ropsten: {
      provider: ropstenProvider,
      // gas: 4600000,
      // gasPrice: web3.toWei("20", "gwei"),
      network_id: 3
    },
    // rinkeby - 测试网络
    rinkeby: {
      provider: rinkebyProvider,
      gas: 4600000,
      // gasPrice: web3.toWei("20", "gwei"),
      network_id: 4
    }
    // mainnet - 主网
    // mainnet: {
    //   provider: mainnetProvider,
    //   gas: 4600000,
    //   gasPrice: web3.toWei("9", "gwei"),  // 参考当前：https://etherscan.io/gastracker
    //   network_id: 1
    // }
  }
};
