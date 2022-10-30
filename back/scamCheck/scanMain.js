scanscam = require("./scanscam.js");
scanscamAddress = require("./scanscamaddress.js");

exports.scamCheck = async function scamCheck(contractAddress, network) {
    scanscamtoken = scanscam["func"];
    scanscamaddress = scanscamAddress["func"];
    scanresult = await scanscamtoken(contractAddress, network);
    scanaddressresult = await scanscamaddress(contractAddress, network);
    //return { "scamAdress": scanaddressresult, "scamToken": scanresult }
    let result = false
    if (scanaddressresult || scanresult) result = true
    return { "result": result }
};