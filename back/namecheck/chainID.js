const axios = require('axios');
const getNetwork = require("./getNetwork.js");

chainID = async function (contractAddress) {
    networkArray = ["eth","bsc","polygon"];
    chaindict = {}
    
    for(var i=0;i<networkArray.length;i++){
        eachNetwork = networkArray[i]
        const etherscan_key = getNetwork.getNetworkKey(eachNetwork)
        const networkURL = "https://" + getNetwork.getNetworkRoot(eachNetwork)
        const requestURL = networkURL + `api?module=account&action=txlist&address=${contractAddress}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${etherscan_key}`

        try {
            const rawresponse = await axios.post(requestURL);
            const response = rawresponse["data"]
            if (response !== undefined) {
                chaindict[eachNetwork] = response["status"] == "1" ? "exists" : "doesn't exist";
            } else {
                const errorMessage = `Error in API response. Status code ${response["status"]}, message was ${response["message"]}`
                chaindict[eachNetwork] = false
            }
        } catch (err) {
            console.log("error:" + err.name + ': ' + err.message);
            chaindict[eachNetwork] = false
        }
    }
    return chaindict
}

exports.func = chainID;