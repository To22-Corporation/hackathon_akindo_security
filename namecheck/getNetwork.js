exports.getNetworkRoot = function getNetworkRoot(network) {
    if (network == "eth") {
        return "api.etherscan.io/"
    }
    else if (network == "bsc") {
        return "api.bscscan.com/"
    }
    else if (network == "polygon") {
        return "api.polygonscan.com/"
    }
}

exports.getNetworkKey = function getNetworkKey(network) {
    if (network == "eth") {
        return process.env.EHTERSCAN_KEY
    }
    else if (network == "bsc") {
        return process.env.BSCSCAN_KEY
    }
    else if (network == "polygon") {
        return process.env.POLYGONSCAN_KEY
    }
}