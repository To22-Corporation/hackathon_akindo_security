chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request == 'CHECK') {
  document.body.style.backgroundColor = 'red'
  }
})