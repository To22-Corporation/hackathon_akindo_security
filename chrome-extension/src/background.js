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

      fetch("https://hackathon-security.herokuapp.com/getAddressOnHtml", param)
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          if (data[0] && data != "error") {
            chrome.windows.create({
              url: "https://hackathon-akindo-security.vercel.app/" + `?address=${data[0]}`,
              focused: true,
              type: 'popup',
              height: 600,
              width: 500
            });
          }
        });
    });
  }
});

function showAlert() {
  alert(Data);
}
