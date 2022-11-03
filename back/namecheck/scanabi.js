const getABI = require("./etherscan_api.js");

scanabi = async function (contractAddress, network) {
    getabi = getABI["func"];
    response = await getabi(contractAddress, network);
    responseJSON = JSON.parse(response)

    ERC20interface = { 'name': [], 'symbol': [], 'decimals': [], 'totalSupply': [], 'balanceOf': ['address'], 'transfer': ['address', 'uint256'], 'transferFrom': ['address', 'address', 'uint256'], 'approve': ['address', 'uint256'], 'allowance': ['address', 'address'] }
    ERC20functions = Object.keys(ERC20interface);
    ABIlength = Object.keys(responseJSON).length

    console.log(("name" in ERC20functions))
    var otherFunction = []
    // tokenに実装されていることを知っておきたい情報？（偏見）関数名にStringが含まれているとTrueと返す。
    // 実装レベルで検証したいが、自動化する場合はむずかしいかも
    var warningDict = {
        "owner": false,
        "mint": false,
        "burn": false,
        "freeze": false,
        "pause": false,
        "blacklist": false,
        "whitelist": false,
        "upgradable": false
    }

    for (var i = 0; i < ABIlength; i++) {
        // 型がFunctionの項目のみ検査
        if (responseJSON[i]["type"] == "function") {
            // ERC20に一般的に含まれる関数名の場合はパス
            eachFunctionName = responseJSON[i]["name"]
            if (!ERC20functions.includes(eachFunctionName)) {
                otherFunction.push(eachFunctionName)
            } else {
                // console.log(eachFunctionName)
            }
            // warningDictの名前が含まれていた場合はTrueにする
            for (let key of Object.keys(warningDict)) {
                if (key == !"upgradable"){
                    if (eachFunctionName.toLowerCase().includes(key)) {
                        warningDict[key] = true
                    }                     
                } else {
                    if (eachFunctionName.toLowerCase().includes("implementation")) {
                        warningDict[key] = true
                    }     
                }
            }
            // 型がFunction以外の場合
        } else {
            console.log("event or constructor:", responseJSON[i]["name"])
        }
    }
    const data = { "otherFunction": otherFunction, "warningDict": warningDict }

    return data
}

exports.func = scanabi;