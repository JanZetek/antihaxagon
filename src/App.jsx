const App = () => {

  const openSettings = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      })

      if (tab?.windowId === undefined) {
        console.error("Nepodařilo se zjistit ID okna.")
        return
      }

      await chrome.runtime.sendMessage({
        action: "openSettings",
        windowId: tab.windowId
      })
    } catch (error) {
      console.error("Chyba při otevírání Side Panelu:", error)
    }
  }

  return (
    <>
      <h1>Vyber model</h1>
      <button>Vypracovat</button>
      <button
        onClick={openSettings}
      >Nastavení</button>
    </>
  )
}

export default App