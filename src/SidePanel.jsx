import { useState, useEffect } from "react"

const SidePanel = () => {
    
    const [APIs, setAPIs] = useState([])
    const [showAdd, setShowAdd] = useState(false)
    const [typeAPI, setTypeAPI] = useState("Open AI")
    const [urlInput, setUrlInput] = useState("")
    const [keyInput, setKeyInout] = useState("")
    
    const getAPIs = async () => {
        const data = await chrome.storage.local.get("API")

        const apis = data.API ?? []

        setAPIs(apis)
    }

    useEffect(() => {
        getAPIs()
    }, [])

    const onAddModel = async () => {
        if (urlInput === "") {
            alert("Nezadali jste URL adresu")
            return
        }

        let url = ""
        let headers = {}

        if (typeAPI === "Open AI") {
            url = `${urlInput}/model`
        } else if (typeAPI === "Ollama") {
            url = `${urlInput}/api/tags`
        }

        headers["method"] = "GET"

        if (keyInput !== "") {
            headers["Authorization"] = `Bearer ${keyInput}`
        }

        try {
            const response = await fetch(url, headers)
    
            const result = await response.json()

            const storageData = await chrome.storage.local.get("API")

            const oldAPIs = storageData.API ?? []

            const newAPIs = [...oldAPIs, {type: typeAPI, url: urlInput, key: keyInput}]

            chrome.storage.local.set({"API": newAPIs})

            alert("Úspěšně vloženo")

            setUrlInput("")
            setKeyInout("")
            setShowAdd(false)
            getAPIs()

        } catch (e) {
            alert("Zkontrolujte připojení k AI")
            throw new Error(e)
        }
    }

    const removeAPI = async (index) => {
        const data = await chrome.storage.local.get("API")

        const APIs = data.API ?? []

        APIs.splice(index, 1)

        await chrome.storage.local.set({"API": APIs})

        alert("Úspěšně odstraněno!")

        getAPIs()
    }

    return (
        <>
            <h1>Nastavení</h1>

            <h2>Nastavení poskytovatele AI služby</h2>

            <h3>Nastavené modely:</h3>
            <ul>
                {APIs.map((API, index) => (
                    <li>
                        <div>
                            <label>{API.url}</label>
                            <button
                                onClick={() => removeAPI(index)}
                            >Odstranit</button>
                        </div>
                    </li>
                ))}
            </ul>
            
            <form 
                style={{display: showAdd ? "block" : "none"}}
                action={onAddModel}
            >
                <label>Vyberte typ API:</label>
                <select
                    value={typeAPI}
                    onChange={e => setTypeAPI(e.target.value)}
                >
                    <option value="Open AI">Open AI</option>
                    <option value="Ollama">Ollama</option>
                </select>
                <input 
                    type="url" 
                    placeholder="URL adresa" 
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    required
                />
                <p>Poslední lomítko nepiš, uveď i protokol.</p>
                <input 
                    type="text" 
                    placeholder="API klíč"
                    value={keyInput}
                    onChange={e => setKeyInput(e.target.value)}
                />
                <p>Nepovinné</p>
                <button type="submit">Potvrdit</button>
            </form>
            <button onClick={() => setShowAdd(!showAdd)}>Přidat</button>
        </>
    )
}

export default SidePanel