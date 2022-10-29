const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const fs = require('fs').promises
var { exec } = require('child_process');

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
dotenv.config();

const scanABI = require("./namecheck/scanabi.js");

//ERC20テスト実行API
app.post("/erc20scan", async (req, res) => {
  const contractAddress = req.body.encodedAddress;
  if (contractAddress.length != 42) {
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
  const encoderesult = encodeURI(result)
  res.json({ message: encoderesult });
});

//ERC20関数確認API
app.get("/erc20FunctionCheck", async (req, res) => {
  const contract_address = process.env.CONTRACT_ADDRESS
  const scanabi = scanABI["func"]
  const scanresult = await scanabi(contract_address)
  // ERC20規格以外の関数名と怪しい関数名チェックの結果を返す
  console.log("scan result", scanresult);
})

//ERC20トランザクション確認API
app.get("/transactionCheck", async (req, res) => {

})


app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
