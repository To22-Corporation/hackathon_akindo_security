const Web3 = require('web3');

getTotalSupply = async function (contractAddress, network) {

    let rpcURL
    if (network == "eth") rpcURL = "https://rpc.flashbots.net/"
    else if (network == "bsc") rpcURL = `https://radial-blue-slug.bsc.discover.quiknode.pro/${process.env.BSC_QUICKNODE}/`
    else if (network == "polygon") rpcURL = `https://polygon-mainnet.g.alchemy.com/v2/${process.env.MATIC_ALCHEMY}`
    const web3 = new Web3(rpcURL)
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

