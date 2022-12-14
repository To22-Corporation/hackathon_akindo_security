const puppeteer = require('puppeteer');

getContractInWebsite = async function (URL) {
    try {
        // Heroku環境かどうかの判断
        const LAUNCH_OPTION = process.env.DYNO ?
            {
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                ignoreDefaultArgs: ['--disable-extensions']
            } :
            { headless: false };
        const browser = await puppeteer.launch(
            LAUNCH_OPTION
        )

        const page = await browser.newPage();
        // await page.goto(URL);

        // Consoleに出力される文字列を取得。Badge等ではHTMLの要素にはAddressないけど、Consoleに出力されているからそれを検知できるように。
        const consoleOutput = []
        let message
        page.on('console', msg => {
            for (let i = 0; i < msg.args().length; ++i)
                message = msg.args()[i]
            if (message) {
                console.log(`${i}: ${message}`);
                console.log(message.jsonValue())
                consoleOutput.push(message.toString())
            }
        });

        //HTML要素に含まれるAddressを取得
        await page
            .goto(URL, {
                waitUntil: "networkidle0",
            })
            .catch((err) => console.log("error loading url", err));

        var template = await page.content()

        var regex = /0x/gi, result, indices = [];
        while ((result = regex.exec(template))) {
            indices.push(result.index);
        }

        //Addressを一つのArrayにまとめなおす
        allAddress = []

        for (var i = 0; i < indices.length; i++) {
            oneIndex = indices[i]
            rawAddress = template.slice(oneIndex, oneIndex + 42)
            if (rawAddress.slice(0, 2) == "0x") {
                address = rawAddress.toLowerCase();
                // console.log(address)
                if (/^[a-zA-Z0-9]+$/.test(address)) {
                    allAddress.push(address);
                }
            }
        }
        // console.log(uniqueAddress)
        for (var i = 0; i < consoleOutput.length; i++) {
            eachOutput = consoleOutput[i];
            if (eachOutput.includes("0x")) {
                index = eachOutput.indexOf("0x")
                allAddress.push(eachOutput.slice(index, index + 42))
            }
        }

        let uniqueAddress = [...new Set(allAddress)];

        return uniqueAddress
    }
    catch {
        return "error"
    }
}

exports.func = getContractInWebsite;