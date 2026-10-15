chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "openSettings") {
        chrome.sidePanel.open({
            windowId: message.windowId
        })
    } else {
        console.log("Neodpovídající zpráva")
    }
})