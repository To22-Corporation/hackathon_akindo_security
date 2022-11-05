const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const fs = require('fs').promises
var { exec } = require('child_process');

app.set('port', (process.env.PORT || 3000));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
dotenv.config();

const scanABI = require("./namecheck/scanabi.js");
const chainID = require("./namecheck/chainID.js");
const scamCheck = require("./scamCheck/scanMain.js");
const getTokenAmount = require("./transactionCheck/TotalSupplyMain.js");
const scanHtml = require("./namecheck/htmlCheck.js");

//ERC20テスト実行API
app.post("/erc20Test", async (req, res) => {
  const { contractAddress, network } = req.body;
  if (!contractAddress || contractAddress.length != 42 || (network != "eth" && network != "bsc" && network != "polygon")) {
    res.status(400).json({
      status: false,
      message: "arguments error",
    });
    return
  }
  try {
    await fs.writeFile("temp.txt", `{"contractAddress":"${contractAddress}","network":"${network}"}`, (err) => {
      if (err) throw err;
    });
    const result = await new Promise((resolve, reject) => {
      exec('npx hardhat test', (error, stdout, stderr) => {
        const response = decodeURIComponent(stdout)
        if (error) {
          resolve(response);
        } else {
          //エラーない場合はもっとシンプルなレスポンスでもいいかも
          resolve(response);
        }
      });
    });
    console.log(result)

    if (result.includes("Error: NotVerified")) {
      res.status(400).json({
        status: false,
        message: "not verified",
      });
      return
    }
    if (result.includes("0 passing") && result.includes("1 failing")) {
      res.status(400).json({
        status: false,
        message: "test error",
      });
      return
    }

    const resultResponse = {
      result_contract_name: result.includes("✔ name should return a string value"),//コントラクト名のチェック
      result_symbol_name: result.includes("✔ symbol should return a string value"),//シンボル名のチェック
      result_decimal: result.includes("✔ decimal should return a number"),//単位のチェック
      result_balance: result.includes("✔ balanceOf should return correct amount for each user"),//発行量のチェック
      result_cant_transfer_by_owner: result.includes("✔ transfer cannot be used by owner that does not have tokens"),//オーナー送金不可のチェック
      result_cant_transfer_by_user: result.includes("✔ transfer cannot be used by user that does not have enough tokens"),//ユーザー送金不可のチェック
      result_transfer_1: result.includes("✔ transfer can be used by user that has enough tokens 1"),//不足時送金不可のチェック
      result_transfer_2: result.includes("✔ transfer can be used by user that has enough tokens 2"),//不足時送金不可のチェック
      result_not_approve_0: result.includes("✔ allowance returns 0 when not approved"),//非認証時のチェック
      result_not_approve_amount: result.includes("✔ allowance returns amount when not approved"),//非認証時のチェック
      result_approve_user_1: result.includes("✔ approve user can spend token 1"),//送金のチェック
      result_approve_user_2: result.includes("✔ approve user can spend token 2"),//送金のチェック
      result_approve_user_3: result.includes("✔ approve user can spend token 3"),//送金のチェック
      result_transferfrom_owner: result.includes("✔ transferFrom cannot be used by owner that does not have tokens"),//オーナー送金不可のチェック
      result_transferfrom_user: result.includes("✔ transferFrom cannot be used by user that does not have enough tokens")//ユーザー送金不可のチェック
    }
    const count = (JSON.stringify(resultResponse).match(/true/g) || [])
    resultResponse.score = Math.round(count.length / 15 * 100)
    res.json(resultResponse);
  } catch (e) {
    console.log(e)
  }
});

//ERC20関数確認API
app.post("/erc20FunctionCheck", async (req, res) => {
  const { contractAddress, network } = req.body;
  if (!contractAddress || contractAddress.length != 42 || (network != "eth" && network != "bsc" && network != "polygon")) {
    res.status(400).json({
      status: false,
      message: "arguments error",
    });
    return
  }
  try {
    const scanabi = scanABI["func"]
    const scanResult = await scanabi(contractAddress, network)
    // ERC20規格以外の関数名と怪しい関数名チェックの結果を返す
    // const funcCount = scanResult.otherFunction.length
    const trueCount = (JSON.stringify(scanResult.warningDict).match(/true/g) || []).length
    const score = 100 - Math.round(Number(trueCount) / Number(Object.keys(scanResult.warningDict).length) * 100)
    scanResult.score = score
    res.json(scanResult);
  } catch (e) {
    console.log(e)
  }
})

//ERC20トランザクション確認API
app.post("/erc20TransactionCheck", async (req, res) => {
  const { contractAddress, network } = req.body;
  if (network == "polygon") {
    res.status(400).json({
      status: false,
      message: "polygon is not supported",
    });
    return
  }
  if (!contractAddress || contractAddress.length != 42 || (network != "eth" && network != "bsc" && network != "polygon")) {
    res.status(400).json({
      status: false,
      message: "arguments error",
    });
    return
  }
  const response = await getTokenAmount.getTokenAmount(contractAddress, network)
  res.json({ score: response });
})

//スキャム歴のあるアドレス・トークンの確認
app.post("/erc20ScamCheck", async (req, res) => {
  const { contractAddress, network } = req.body;
  if (!contractAddress || contractAddress.length != 42 || (network != "eth" && network != "bsc" && network != "polygon")) {
    res.status(400).json({
      status: false,
      message: "arguments error",
    });
    return
  }
  const response = await scamCheck.scamCheck(contractAddress, network)
  res.json(response);
})

//OxアドレスからチェーンIDを判定する
app.post("/checkchainID", async (req, res) => {
  chainIDfunc = chainID["func"]
  console.log("thanks for calling")
  const { contractAddress } = req.body;
  console.log(contractAddress);
  if (!contractAddress || contractAddress.length != 42 || contractAddress.slice(0, 2) != "0x") {
    res.status(400).json({
      status: false,
      message: "arguments error",
    });
    return
  }
  const response = await chainIDfunc(contractAddress);
  res.json(response)
})

//HTML上のコントラクトアドレスを抽出するAPI
app.post("/getAddressOnHtml", async (req, res) => {
  try {
    const { URL } = req.body;
    console.log(URL)
    if (!URL || URL.indexOf('http') == -1) {
      res.status(400).json({
        status: false,
        message: "param error",
      });
      return
    }
    const response = await scanHtml.func(URL)
    res.json(response);
  } catch (e) {
    console.log(e)
  }
})


app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'));
});