const { expect } = require("chai");
const { ethers } = require("hardhat");
const dotenv = require("dotenv");
const axios = require("axios");
const fs = require('fs').promises
const getNetwork = require("../namecheck/getNetwork.js");

dotenv.config();

let rawAddresses, owner, deployedContract;
var assert = require('chai').assert

let contract_address, creatinBytecode, abi, etherscan_network, etherscan_key
let alteredArguments = []

describe("ERC20 test", function () {
  getConstructorArguments = async (input, abi) => {
    input = input.toLowerCase().replace("0x", "");

    const CODECOPY_REGEX = /(?:5b)?(?:60([a-z0-9]{2})|61([a-z0-9_]{4})|62([a-z0-9_]{6}))80(?:60([a-z0-9]{2})|61([a-z0-9_]{4})|62([a-z0-9_]{6}))6000396000f3fe/gm;

    m = CODECOPY_REGEX.exec(input)

    if (m == null || m == undefined) {
      throw Error("Input is not a standard deployement bytecode");
    }

    const CONTRACT_LENGTH = parseInt(m[1] || m[2] || m[3], 16) * 2
    const CONTRACT_OFFSET = parseInt(m[4] || m[5] || m[6], 16) * 2

    parsedconstructor = input.slice(0, CONTRACT_OFFSET + CONTRACT_LENGTH)
    arguments = input.slice(CONTRACT_OFFSET + CONTRACT_LENGTH)
    const result = ethers.utils.defaultAbiCoder.decode(
      abi,
      "0x" + arguments
    )
    return [parsedconstructor, result]

  }

  before(async function () {
    const readFile = JSON.parse(await fs.readFile("temp.txt", "utf-8"))
    contract_address = readFile.contractAddress
    etherscan_network = getNetwork.getNetworkRoot(readFile.network)
    etherscan_key = getNetwork.getNetworkKey(readFile.network)
    const getTransactionLogs = await axios.post(`https://${etherscan_network}api?module=account&action=txlist&address=${contract_address}&page=1&offset=1&apikey=${etherscan_key}`)
    creatinBytecode = getTransactionLogs.data.result[0].input
    //Abiを取得する
    const getAbi = await axios.post(`https://${etherscan_network}/api?module=contract&action=getabi&address=${contract_address}&apikey=${etherscan_key}`)
    if (getAbi.data.result == "Contract source code not verified") {
      throw new Error('NotVerified')
    }
    else {
      abi = JSON.parse(getAbi.data.result)
      constructor = []
      for (each in abi) {
        if (abi[each]["type"] == "constructor") {
          for (i in abi[each]["inputs"]) {
            constructor.push(abi[each]["inputs"][i]["internalType"])
          }
        }
        if (abi[each]["type"] == "function" && abi[each]["name"] == "implementation") {
          throw new Error('UpgradeableProxy')
        }
      }
    }
    //コンストラクタの引数を取得
    [parsedconstructorbytecode, arguments] = await getConstructorArguments(creatinBytecode, constructor)
    //constructor内でAddressは重要ロールのEOAか、トークンなどのアドレス。だからデフォルトではOwnerに指定できるようにする
    for (var i = 0; i < constructor.length; i++) {
      if (constructor[i] == "address") {
        alteredArguments.push(owner.address);
      } else {
        alteredArguments.push(arguments[i])
      }
    }
  })

  beforeEach(async function () {
    if (abi) {
      rawAddresses = await ethers.getSigners();
      owner = rawAddresses[0];
      const getContract = await ethers.getContractFactory(abi, parsedconstructorbytecode);
      deployedContract = await getContract.deploy(...alteredArguments);
      await deployedContract.deployed()

      try {
        await deployedContract.connect(owner).mint(rawAddresses[0].address, 100);
      } catch {
        try {
          await deployedContract.connect(owner).mint(100);
        }
        catch { }
      }
    } else {
      throw new Error('Abi Error')
    }
  })

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
  it("decimal should return a number", async () => {
    const tokenDecimal = await deployedContract.decimals();
    assert.typeOf(tokenDecimal, "number", "token decimal is not a number");
  });

  /** balanceOf test */
  it("balanceOf should return correct amount for each user", async () => {
    /** ownerが全トークンを初期持っている。毎回この前提ではよくないが、constructorでSupplyをOwnerに分けるのはよくみる */
    const ownerbalance = await deployedContract.balanceOf(owner["address"]);
    const tokensupply = await deployedContract.totalSupply();
    const result = expect(tokensupply).to.equal(ownerbalance);

    /** transferした後もBalanceが反映されている */
    if (result) {
      let rawBalance = await deployedContract.balanceOf(rawAddresses[1].address)
      expect(rawBalance).to.equal(0);
      await deployedContract.transfer(rawAddresses[1].address, 1);
      rawBalance = await deployedContract.balanceOf(rawAddresses[1].address)
      expect(rawBalance).to.equal(1);
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
      await expect(deployedContract.connect(rawAddresses[i]).transfer(rawAddresses[i + 1].address, 1)).to.be.reverted;
    }
  });
  /** トークンを持ってる分以上はTransferできない */
  it("transfer cannot be used by user that does not have enough tokens", async () => {
    const userbalance = await deployedContract.balanceOf(rawAddresses[0].address);
    const totalsupply = await deployedContract.totalSupply();
    expect(userbalance).to.equal(totalsupply);
    //REVERTすることを確認。
    //ToDo:REVERTしているかどうかで判定するロジックに変更
    await expect(deployedContract.connect(owner).transfer(rawAddresses[1].address, totalsupply.add(1))).to.be.reverted;
  });
  /** トークンを持っているぶんはTransferできる */
  it("transfer can be used by user that has enough tokens 1", async () => {
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

  /** トークンを持っているぶんはTransferできる */
  it("transfer can be used by user that has enough tokens 2", async () => {
    /** ownerが全Supplyを持っている */
    const ownerbalance = await deployedContract.balanceOf(owner.address);
    const totalsupply = await deployedContract.totalSupply();
    expect(ownerbalance).to.equal(totalsupply);

    /** Supplyの一部を別ユーザーに送金する */
    await deployedContract.connect(owner).approve(rawAddresses[1].address, 1);
    await deployedContract.connect(rawAddresses[1]).transferFrom(rawAddresses[0].address, rawAddresses[3].address, 1);
    const user1balance = await deployedContract.balanceOf(rawAddresses[3].address);
    expect(user1balance).to.equal(1);
    expect(await deployedContract.balanceOf(owner.address)).to.equal(totalsupply.sub(1));
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
  it("approve user can spend token 1", async () => {
    await expect(deployedContract.connect(rawAddresses[1]).transferFrom(owner.address, rawAddresses[1].address, 1)).to.be.reverted;
    await deployedContract.connect(owner).approve(rawAddresses[1].address, 1);
    expect(await deployedContract.balanceOf(rawAddresses[1].address)).to.equal(0);
    await deployedContract.connect(rawAddresses[1]).transferFrom(owner.address, rawAddresses[1].address, 1);
    expect(await deployedContract.balanceOf(rawAddresses[1].address)).to.equal(1);
  });

  /** approved addresss cannot spend more token than approved amount */
  it("approve user can spend token 2", async () => {
    await expect(deployedContract.connect(rawAddresses[1]).transferFrom(owner.address, rawAddresses[1].address, 1)).to.be.reverted;
    await deployedContract.connect(owner).approve(rawAddresses[1].address, 1);
    expect(await deployedContract.balanceOf(rawAddresses[1].address)).to.equal(0);
    await expect(deployedContract.connect(rawAddresses[1]).transferFrom(owner.address, rawAddresses[1].address, 2)).to.be.reverted;
  });

  /** not approved address cannot use token */
  it("approve user can spend token 3", async () => {
    const allowance = await deployedContract.allowance(rawAddresses[1].address, rawAddresses[2].address);
    expect(allowance).to.equal(0);
    await expect(deployedContract.transferFrom(rawAddresses[1].address, rawAddresses[2].address, 1)).to.be.reverted;
  });

  /** transferFrom test */
  it("transferFrom cannot be used by owner that does not have tokens", async () => {
    const userbalance = await deployedContract.balanceOf(rawAddresses[1].address);
    expect(userbalance).to.equal(0);
    await deployedContract.connect(rawAddresses[1]).approve(rawAddresses[2].address, 1);
    await expect(deployedContract.connect(rawAddresses[2]).transferFrom(rawAddresses[1].address, rawAddresses[3].address, 1)).to.be.reverted;
  });
  /** トークンを持ってる分以上はTransferできない */
  it("transferFrom cannot be used by user that does not have enough tokens", async () => {
    const userbalance = await deployedContract.balanceOf(rawAddresses[0].address);
    const totalsupply = await deployedContract.totalSupply();
    expect(userbalance).to.equal(totalsupply);
    await deployedContract.connect(owner).approve(rawAddresses[1].address, 1);
    await expect(deployedContract.connect(rawAddresses[1]).transferFrom(owner.address, rawAddresses[2].address, totalsupply + 1)).to.be.reverted;
  });


});