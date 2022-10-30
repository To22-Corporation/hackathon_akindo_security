const axios = require('axios');
const getNetwork = require("./getNetwork.js");

getabi = async function (contractAddress, network) {
    const etherscan_key = getNetwork.getNetworkKey(network)
    const networkURL = "https://" + getNetwork.getNetworkRoot(network)

    const requestURL = networkURL + `api?module=contract&action=getabi&address=${contractAddress}&apikey=${etherscan_key}`
    try {
        const rawresponse = await axios.post(requestURL);
        const response = rawresponse["data"]
        if (response !== undefined) {
            if (response["message"] == "OK" && response["status"] == "1") {
                return response["result"]
            } else {
                const errorMessage = `Error in API response. Status code ${response["status"]}, message was ${response["message"]}`
                return errorMessage
            }
        }
    } catch (err) {
        console.log("error:" + err.name + ': ' + err.message);
        return false
        process.exit(-1);
    }
}

exports.func = getabi;