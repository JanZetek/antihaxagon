import { useState, useEffect } from "react"

const App = () => {

  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState(models.at(0) ?? "")

  useEffect(() => {

    const getModels = async () => {

      const data = await chrome.storage.local.get("API")

      const APIs = data.API ?? []
      
      const apiModels = []

      APIs.forEach(async (API) => {
        if (API.type === "Open AI") {
          
          let url = `${API.url}/models`
          let headers = {}

          headers["method"] = "GET"

          if (API.key !== "") {
            headers["Authentication"] = `Bearer ${API.key}`
          }

          const response = await fetch(url, headers)

          const result = await response.json()

          console.log(result)


          result.data.forEach(model => {
            apiModels.push(model.id)
          })

          console.log(apiModels)

        } else if (API.type === "Ollama") {

        }

        console.log(apiModels)
        setModels(apiModels)
      })
    }

    getModels()

  }, [])

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
      <select
        value={selectedModel}
        onChange={e => setSelectedModel(e.target.value)}
      >
        {models.map(model => (
          <option value={model}>{model}</option>
        ))}
      </select>
      <button>Vypracovat</button>
      <button
        onClick={openSettings}
      >Nastavení</button>
    </>
  )
}

export default App