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
const scamCheck = require("./scamCheck/scanMain.js");
const getTokenAmount = require("./transactionCheck/TotalSupplyMain.js");

//ERC20テスト実行API
app.post("/erc20Test", async (req, res) => {
  const { contractAddress, network } = req.body;
  if (!contractAddress || contractAddress.length != 42 || (network != "eth" && network != "bsc" && network != "polygon")) {
    res.status(401).json({
      status: false,
      message: "arguments error",
    });
  }
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
    return res.status(401).json({
      status: false,
      message: "not verified",
    });
  }
  if (result.includes("0 passing") && result.includes("1 failing")) {
    return res.status(401).json({
      status: false,
      message: "test error",
    });
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
});

//ERC20関数確認API
app.post("/erc20FunctionCheck", async (req, res) => {
  const { contractAddress, network } = req.body;
  if (!contractAddress || contractAddress.length != 42 || (network != "eth" && network != "bsc" && network != "polygon")) {
    res.status(401).json({
      status: false,
      message: "arguments error",
    });
  }
  const scanabi = scanABI["func"]
  const scanResult = await scanabi(contractAddress, network)
  // ERC20規格以外の関数名と怪しい関数名チェックの結果を返す
  // const funcCount = scanResult.otherFunction.length
  const trueCount = (JSON.stringify(scanResult.warningDict).match(/true/g) || []).length
  const score = Math.round(Number(trueCount) / Number(Object.keys(scanResult.warningDict).length) * 100)
  scanResult.score = score
  res.json(scanResult);
})

//ERC20トランザクション確認API
app.post("/erc20TransactionCheck", async (req, res) => {
  const { contractAddress, network } = req.body;
  if (!contractAddress || contractAddress.length != 42 || (network != "eth" && network != "bsc" && network != "polygon")) {
    res.status(401).json({
      status: false,
      message: "arguments error",
    });
  }
  const response = await getTokenAmount.getTokenAmount(contractAddress, network)
  console.log(response)
  res.json(response);
})

//スキャム歴のあるアドレス・トークンの確認
app.post("/erc20ScamCheck", async (req, res) => {
  const { contractAddress, network } = req.body;
  if (!contractAddress || contractAddress.length != 42 || (network != "eth" && network != "bsc" && network != "polygon")) {
    res.status(401).json({
      status: false,
      message: "arguments error",
    });
  }
  const response = await scamCheck.scamCheck(contractAddress, network)
  res.json(response);
})


app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'));
});