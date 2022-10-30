var fileSystem = require("fs");

scanscamtoken = async function (contractAddress, network) {
    const result = await new Promise((resolve, reject) => {
        fileSystem.readFile(`./scamCheck/${network}_parsedscamremoveduplicate.txt`, 'utf-8', function (error, data) {
            if (error) throw error;
            else {
                parsedData = data.toString().replace(/\r/g, "").split("\n");
                if (parsedData.includes(contractAddress)) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            }
        });
    });
    return result
}

exports.func = scanscamtoken;