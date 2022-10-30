const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
var { exec } = require('child_process'); // native in nodeJs

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//ERC20テスト実行API
app.get("/erc20scan", async (req, res) => {
  //const encodedAddress = req.query.address;
  //const searchAddress = decodeURI(encodedAddress)
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
  encoderesult = encodeURI(result)
  res.json({ message: encoderesult });
});

//ERC20関数確認API
app.get("/erc20FunctionCheck", async (req, res) => {

})

//ERC20トランザクション確認API
app.get("/transactionCheck", async (req, res) => {

})


app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});