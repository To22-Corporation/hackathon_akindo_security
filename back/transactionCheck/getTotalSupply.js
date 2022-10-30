const Web3 = require('web3');

getTotalSupply = async function (contractAddress, network) {

    let rpcURL, web3
    if (network == "eth") {
        rpcURL = "https://rpc.flashbots.net/"
        web3 = new Web3(rpcURL)
    }
    else if (network == "bsc") {
        rpcURL = `https://bsc-dataseed1.binance.org:443`
        web3 = new Web3(rpcURL)
    }
    else if (network == "polygon") {
        rpcURL = `https://polygon-rpc.com/`
        web3 = new Web3(rpcURL)
    }
    const abi = [{ "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }]
    const contract = new web3.eth.Contract(abi, contractAddress)
    let decimals = await new Promise((resolve, error) => {
        contract.methods.decimals().call((err, result) => {
            if (err) {
                console.error('Error: ', err);
                // handle the error here
            }
            resolve(result)
        });
    })

    let totalSupply = await new Promise((resolve, error) => {
        contract.methods.totalSupply().call((err, result) => {
            if (err) {
                console.error('Error: ', err);
                // handle the error here
            }
            resolve(result)
        });
    })
    return totalSupply * 10 ** (-decimals)
}

exports.func = getTotalSupply;

