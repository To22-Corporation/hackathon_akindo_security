const { expect } = require("chai");
const { ethers } = require("hardhat");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

let rawAddresses, owner, deployedContract;
var assert = require('chai').assert

describe("ERC20 test sample", function () {

  //なぜかsetTimeOutの中じゃないとbeforeEachにエラーが出る。。。
  setTimeout(() => {
    beforeEach(async function () {
      const contract_address = process.env.CONTRACT_ADDRESS
      const etherscan_key = process.env.EHTERSCAN_KEY

      //const etherscan_network = "api.etherscan.io" //ETHER MAINNET
      const etherscan_network = "api.bscscan.com" //BSC

      const getTransactionLogs = await axios.post(`https://${etherscan_network}/api?module=account&action=txlist&address=${contract_address}&page=1&offset=1&apikey=${etherscan_key}`)
      const creatinBytecode = getTransactionLogs.data.result[0].input
      //Abiを取得する
      const getAbi = await axios.post(`https://${etherscan_network}/api?module=contract&action=getabi&address=${contract_address}&apikey=${etherscan_key}`)
      const abi = JSON.parse(getAbi.data.result)
      //コントラクトをデプロイ
      const getContract = await ethers.getContractFactory(abi, creatinBytecode);
      deployedContract = await getContract.deploy();
      await deployedContract.deployed()
    })()
  });

  /* name test */
  it("name should return a string value", async function () {
    const tokenName = await deployedContract.name();
    assert.typeOf(tokenName, 'string', 'token name is not a string');
  });

  /** symbol test */
  it("symbol should return a string value", async function () {
    const tokenSymbol = await deployedContract.symbol();
    assert.typeOf(tokenSymbol, 'string', 'token symbol is not a string');
  });

  /** decimal test */
  /** このテストよくない。現状uintでもfloatでもなんでも返してもPassしてしまう。それと現状だとNumberだけどBigNumberとして扱う必要があるから変えないと。SolidityではFloatがない（多分）から大丈夫かな？要確認 */
  it("decimal should return a number", async () => {
    const tokenDecimal = await deployedContract.decimals();
    assert.typeOf(tokenDecimal, "number", "token decimal is not a number");
  });

  /** total supply test */
  /** 現状Passしない。BigNumberのAssetが必要。 */
  it("total suppy should return a number", async () => {
    const tokenTotalSupply = await deployedContract.totalSupply();
    assert.typeOf(tokenTotalSupply, "BigNumber", "token TotalSupply is not a number");
  });

  /** balanceOf test */
  /** result の後のif 文は恐らく正しくない。どうやったらいいんだろう～～ */
  it("balanceOf should return correct amount for each user", async () => {
    /** ownerが全トークンを初期持っている。毎回この前提ではよくないが、constructorでSupplyをOwnerに分けるのはよくみる */
    const ownerbalance = await deployedContract.balanceOf(owner["address"]);
    const tokensupply = await deployedContract.totalSupply();
    const result = expect(tokensupply).to.equal(ownerbalance);

    /** transferした後もBalanceが反映されている */
    if (result) {
      expect(await deployedContract.balanceOf(rawAddresses[1].address)).to.equal(0);
      await deployedContract.transfer(rawAddresses[1].address, 1);
      expect(await deployedContract.balanceOf(rawAddresses[1].address)).to.equal(1);
    }

    /** その他ユーザーはBalanceが0である。 */
    for (let i = 2; i < 20; i++) {
      expect(await deployedContract.balanceOf(rawAddresses[i].address)).to.equal(0);
    }
  });

  /** transfer test */
  /** トークン持ってないとTransferできない */
  it("transfer cannot be used by owner that does not have tokens", async () => {
    for (let i = 1; i < 10; i++) {
      const userbalance = await deployedContract.balanceOf(rawAddresses[i].address);
      expect(userbalance).to.equal(0);
      await expect(deployedContract.connect(rawAddresses[i]).transfer(rawAddresses[i + 1].address, 1)).revertedWith("ERC20: transfer amount exceeds balance");
    }
  });
  /** トークンを持ってる分以上はTransferできない */
  it("transfer cannot be used by user that does not have enough tokens", async () => {
    const userbalance = await deployedContract.balanceOf(rawAddresses[0].address);
    const totalsupply = await deployedContract.totalSupply();
    expect(userbalance).to.equal(totalsupply);
    await expect(deployedContract.connect(owner).transfer(rawAddresses[1].address, totalsupply + 1)).revertedWith("ERC20: transfer amount exceeds balance");
  });
  /** トークンを持っているぶんはTransferできる */
  it("transfer can be used by user that has enough tokens", async () => {
    /** ownerが全Supplyを持っている */
    const ownerbalance = await deployedContract.balanceOf(owner.address);
    const totalsupply = await deployedContract.totalSupply();
    expect(ownerbalance).to.equal(totalsupply);

    /** 全Supplyを別ユーザーに送金する */
    await expect(deployedContract.transfer(rawAddresses[1].address, totalsupply));
    const user1balance = await deployedContract.balanceOf(rawAddresses[1].address);
    expect(user1balance).to.equal(totalsupply);
    expect(await deployedContract.balanceOf(owner.address)).to.equal(0);
  });

  /** allowance test */
  /** allownance はApproveしていないと0を返す */
  it("allowance returns 0 when not approved", async () => {
    for (let i = 1; i < 10; i++) {
      const userallowance = await deployedContract.allowance(rawAddresses[i].address, rawAddresses[i + 1].address);
      expect(userallowance).to.equal(0);
    }
  });

  /** allowanceはApproveした後にTrueを返す */
  it("allowance returns amount when not approved", async () => {
    for (let i = 1; i < 10; i++) {
      expect(await deployedContract.allowance(rawAddresses[i].address, rawAddresses[i + 1].address)).to.equal(0);
    }
    await deployedContract.connect(rawAddresses[2]).approve(rawAddresses[1].address, 1);
    expect(await deployedContract.allowance(rawAddresses[2].address, rawAddresses[1].address)).to.equal(1);
  });

  /** approve test */
  /** approved address can spend token */
  it("approve user can spend token", async () => {
    await expect(deployedContract.connect(rawAddresses[1]).transferFrom(owner.address, rawAddresses[1].address, 1)).revertedWith("ERC20: insufficient allowance");
    await deployedContract.connect(owner).approve(rawAddresses[1].address, 1);
    expect(await deployedContract.balanceOf(rawAddresses[1].address)).to.equal(0);
    await deployedContract.connect(rawAddresses[1]).transferFrom(owner.address, rawAddresses[1].address, 1);
    expect(await deployedContract.balanceOf(rawAddresses[1].address)).to.equal(1);
  });

  /** approved addresss cannot spend more token than approved amount */
  it("approve user can spend token", async () => {
    await expect(deployedContract.connect(rawAddresses[1]).transferFrom(owner.address, rawAddresses[1].address, 1)).revertedWith("ERC20: insufficient allowance");
    await deployedContract.connect(owner).approve(rawAddresses[1].address, 1);
    expect(await deployedContract.balanceOf(rawAddresses[1].address)).to.equal(0);
    await expect(deployedContract.connect(rawAddresses[1]).transferFrom(owner.address, rawAddresses[1].address, 2)).revertedWith("ERC20: insufficient allowance");
  });

  /** not approved address cannot use token */
  it("approve user can spend token", async () => {
    const allowance = await deployedContract.allowance(rawAddresses[1].address, rawAddresses[2].address);
    expect(allowance).to.equal(0);
    await expect(deployedContract.transferFrom(rawAddresses[1].address, rawAddresses[2].address, 1)).revertedWith("ERC20: insufficient allowance");
  });

  /** transferFrom test */
  it("transferFrom cannot be used by owner that does not have tokens", async () => {
    const userbalance = await deployedContract.balanceOf(rawAddresses[1].address);
    expect(userbalance).to.equal(0);
    await deployedContract.connect(rawAddresses[1]).approve(rawAddresses[2].address, 1);
    await expect(deployedContract.connect(rawAddresses[2]).transferFrom(rawAddresses[1].address, rawAddresses[3].address, 1)).revertedWith("ERC20: transfer amount exceeds balance");
  });
  /** トークンを持ってる分以上はTransferできない */
  it("transferFrom cannot be used by user that does not have enough tokens", async () => {
    const userbalance = await deployedContract.balanceOf(rawAddresses[0].address);
    const totalsupply = await deployedContract.totalSupply();
    expect(userbalance).to.equal(totalsupply);
    await deployedContract.connect(owner).approve(rawAddresses[1].address, 1);
    await expect(deployedContract.connect(rawAddresses[1]).transferFrom(owner.address, rawAddresses[2].address, totalsupply + 1)).revertedWith("ERC20: insufficient allowance");
  });
  /** トークンを持っているぶんはTransferできる */
  it("transfer can be used by user that has enough tokens", async () => {
    /** ownerが全Supplyを持っている */
    const ownerbalance = await deployedContract.balanceOf(owner.address);
    const totalsupply = await deployedContract.totalSupply();
    expect(ownerbalance).to.equal(totalsupply);

    /** 全Supplyを別ユーザーに送金する */
    await deployedContract.connect(owner).approve(rawAddresses[1].address, 1);
    await deployedContract.connect(rawAddresses[1]).transferFrom(rawAddresses[0].address, rawAddresses[3].address, 1);
    const user1balance = await deployedContract.balanceOf(rawAddresses[3].address);
    expect(user1balance).to.equal(1);
    expect(await deployedContract.balanceOf(owner.address)).to.equal(tokensupply - 1);
  });
});