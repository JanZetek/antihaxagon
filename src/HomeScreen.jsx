import "./HomeScreen.css"

import { useEffect } from "react"

const HomeScreen = ({ setCurrentScreen, models, setModels, selectedModel, setSelectedModel }) => {

    console.log(models)
    console.log(selectedModel)

    useEffect(() => {

        const getModels = async () => {
            await chrome.storage.local.remove("answers");

            const data = await chrome.storage.local.get("API")

            const APIs = data.API ?? []

            const apiModels = {}

            APIs.forEach(async (API) => {
                if (API.type === "Open AI") {

                    let url = `${API.url}/models`
                    let headers = {}

                    if (API.key !== "") {
                        headers["Authorization"] = `Bearer ${API.key}`
                    }

                    const response = await fetch(url, {
                        method: "GET",
                        headers
                    })

                    const result = await response.json()

                    console.log(result)

                    result.data.forEach(model => {
                        apiModels[model.id] = {
                            url: API.url,
                            type: API.type,
                            key: API.key
                        }
                    })

                    console.log(apiModels)

                } else if (API.type === "Ollama") {

                }

                console.log(apiModels)
                setModels(apiModels)
                setSelectedModel(Object.keys(apiModels).at(0))
            })
        }

        getModels()

    }, [])

    return (
        <div className="home-screen">
            <h1>Vyber model</h1>
            <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
            >
                {Object.keys(models).map(model => (
                    <option value={model}>{`${model} (${models[model].url})`}</option>
                ))}
            </select>
            <br />
            <button
                onClick={() => setCurrentScreen("solution")}
            >Získat řešení</button>
            <br />
            <button
                onClick={() => setCurrentScreen("notes")}
            >Zápisky</button>
            <br />
            <button
                onClick={() => setCurrentScreen("settings")}
            >Nastavení</button>
        </div>
    )
}

export default HomeScreen