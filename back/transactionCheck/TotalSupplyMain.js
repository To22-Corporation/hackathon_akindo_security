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
            // 上位20%が保有している割合
            const top20SumRate = Math.round(top20amount / totalSupply * 100)
            if (top20SumRate < 50) return 100
            else if (top20SumRate < 60) return 80
            else if (top20SumRate < 70) return 60
            else if (top20SumRate < 80) return 40
            else if (top20SumRate < 90) return 20
            else return 100 - top20SumRate
        } else {
            console.log("token may not exist")
            return false
        }
    } else {
        console.log("error in oklink API")
        return false
    }
};