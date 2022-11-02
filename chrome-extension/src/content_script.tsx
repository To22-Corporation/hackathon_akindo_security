const axios = require("axios");

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request == 'CHECK') {
  //document.body.style.backgroundColor = 'red'
  const getTransactionLogs = await axios.post(`https://${etherscan_network}api?module=account&action=txlist&address=${contract_address}&page=1&offset=1&apikey=${etherscan_key}`)
  }
})