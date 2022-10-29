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

//ERC20テスト実行API
app.post("/erc20Test", async (req, res) => {
  const contractAddress = req.body.contractAddress;
  if (!contractAddress.length || contractAddress.length != 42) {
    res.status(401).json({
      status: false,
      message: "contractAddress error",
    });
  }
  await fs.writeFile("temp.txt", contractAddress, (err) => {
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

  const resultResponse = {
    result1: result.includes("✔ name should return a string value"),
    result2: result.includes("✔ symbol should return a string value"),
    result3: result.includes("✔ decimal should return a number"),
    result4: result.includes("✔ balanceOf should return correct amount for each user"),
    result5: result.includes("✔ transfer cannot be used by owner that does not have tokens"),
    result6: result.includes("✔ transfer cannot be used by user that does not have enough tokens"),
    result7: result.includes("✔ transfer can be used by user that has enough tokens 1"),
    result8: result.includes("✔ transfer can be used by user that has enough tokens 2"),
    result9: result.includes("✔ allowance returns 0 when not approved"),
    result10: result.includes("✔ allowance returns amount when not approved"),
    result11: result.includes("✔ approve user can spend token 1"),
    result12: result.includes("✔ approve user can spend token 2"),
    result13: result.includes("✔ approve user can spend token 3"),
    result14: result.includes("✔ transferFrom cannot be used by owner that does not have tokens"),
    result15: result.includes("✔ transferFrom cannot be used by user that does not have enough tokens")
  }

  res.json(resultResponse);
});

//ERC20関数確認API
app.post("/erc20FunctionCheck", async (req, res) => {
  const contractAddress = req.body.contractAddress;
  const scanabi = scanABI["func"]
  const scanResult = await scanabi(contractAddress)
  // ERC20規格以外の関数名と怪しい関数名チェックの結果を返す
  res.json(scanResult);
})

//ERC20トランザクション確認API
app.get("/erc20TransactionCheck", async (req, res) => {

})


app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'));
});