const axios = require("axios");

const baseURL = "https://www.oklink.com/"
const URLtail = "api/v5/explorer/token/position-list"

const fileSystem = require("fs");

getTokenData = async function (contractAddress, network) {
    config = {
        headers: {
            "Ok-Access-Key": process.env.OKLINK_API_KEY
        }
    }
    if (network == "polygon") network = "matic"

    requestURL = baseURL + URLtail + "?chainShortName=" + network + "&tokenContractAddress=" + contractAddress;

    try {
        response = await axios.get(requestURL, config);
        if (response !== undefined) {
            if (response["statusText"] == "OK" && response["status"] == 200) {
                return response["data"]
            } else {
                errorMessage = `Error in OKlink API response. Status code ${response["status"]}, message was ${response["data"]["msg"]}`
                return errorMessage
            }
        }
    } catch (err) {
        console.log(err.name + ': ' + err.message);
        return false
    }
}



exports.func = getTokenData;