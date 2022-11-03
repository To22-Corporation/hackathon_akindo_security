let Data
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const checkList = [];
  if (changeInfo.status === "complete") {
    chrome.tabs.query({ active: true, currentWindow: true }, (e) => {
      //chrome.tabs.sendMessage(tabId, "CHECK");
      const url = e[0].url;
      console.log(url);
      if (!url || url.indexOf("http") == -1) return;
      if (checkList.includes(url)) return;
      checkList.push(url);

      const param = {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ URL: url }),
      };

      // paramを付ける以外はGETと同じ
      fetch("https://hackathon-security.herokuapp.com/getAddressOnHtml", param)
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            console.log(data);
            Data = data
            chrome.scripting.executeScript({
              function: showAlert
            });
          }
        });
    });
  }
});

function showAlert() {
  alert(Data);
}
