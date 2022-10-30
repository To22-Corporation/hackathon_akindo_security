const tokenData = require("./oklinkTop20.js");
const getTotalSupply = require("./getTotalSupply.js");

exports.getTokenAmount = async function main(contractAddress, network) {

    function convert_to_float(a) {
        var floatValue = +(a);
        return floatValue;
    }

    let top20amount = 0
    const lowercaseContractAddress = contractAddress.toLowerCase();
    const tokenDatafunc = tokenData["func"];
    const getTotalSupplyfunc = getTotalSupply["func"];

    const totalSupply = await getTotalSupplyfunc(contractAddress, network);
    const tokenDataResult = await tokenDatafunc(lowercaseContractAddress, network);

    console.log(totalSupply)
    console.log(tokenDataResult)
    if (tokenDataResult) {
        const tokenDataList = tokenDataResult["data"][0]["positionList"]
        console.log(tokenDataList)
        if (tokenDataList[0] != undefined) {
            for (var i = 0; i < tokenDataList.length; i++) {
                top20amount += convert_to_float(tokenDataList[i]["amount"])
            }
            // console.log(100 * top20amount / totalSupply)
            //return { "totalSupply": totalSupply, "topamount": top20amount, "topuseramount": tokenDataList.length }
            return Math.round(top20amount / totalSupply * 100)
        } else {
            console.log("token may not exist")
            return false
        }
    } else {
        console.log("error in oklink API")
        return false
    }
};