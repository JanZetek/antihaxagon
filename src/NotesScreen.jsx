import "./NotesScreen.css"

import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const NotesScreen = ({ setCurrentScreen, models, selectedModel }) => {

    const [notes, setNotes] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    console.log(models)
    console.log(selectedModel)

    const getNotes = async () => {

        // try {

            const [tab] = await chrome.tabs.query({
                active: true,
                lastFocusedWindow: true
            })
    
            if (!tab?.id) {
                throw new Error("Nepodařilo se načít kartu")
            }
    
            const webText = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
    
                func: () => {
                    const theory = document.querySelector(".markdown")
    
                    if (!theory) {
                        throw new Error("Teorie nebyla nalezena")
                    }
    
                    return theory.innerText
                }
            })

            const text = webText[0]?.result
        
            if (!text) {
                throw new Error("Stránka nevrátila žádný obsah")
            }
    
            console.log("Obsah stránky:", text)
            
            const modelConfig = models[selectedModel]
    
            if (!modelConfig) {
                throw new Error("Vybraný model nebyl nalezen")
            }
    
            // Sestavení URL
            let url = ""
    
            if (modelConfig.type === "Open AI") {
                url = `${modelConfig.url}/chat/completions`
            } else {
                throw new Error(`Nepodporovaný typ poskytovatele: ${modelConfig.type}`)
            }
    
            // Hlavička
            const headers = {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
    
            if (modelConfig.key) {
                headers["Authorization"] = `Bearer ${modelConfig.key}`
            }
    
            console.log("API URL:", url)
            console.log("API key:", modelConfig.key ? "Je nastaven" : "Chybí")
            console.log(headers)

            console.log("Model config:", {
                type: modelConfig.type,
                url: modelConfig.url,
                keyExists: Boolean(modelConfig.key),
                keyLength: modelConfig.key?.length
            })

            console.log("Authorization:", headers.Authorization)

            console.log("Authorization:", headers.Authorization ? `Bearer [${headers.Authorization.length - 7} znaků]` : "CHYBÍ")

            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    model: selectedModel,
                    messages: [
                        {
                            role: "system",
                            content: "Z uživatelova textu zpravuj stručné, bodovité (tj. vyvaruj se větám) zápisky. V odpovědi rovnou odpovídej ve formě zápisků. "
                        },
                        {
                            role: "user",
                            content: text
                        }
                    ],
                    stream: false
                })
            })
    
            const result = await response.json()
    
            setNotes(result.choices?.[0].message?.content)
            setIsLoading(false)


        // } catch (e) {
        //     alert(`Chyba: ${e}`)
            
        // }

    }

    useEffect(() => {
        console.log("Získávání zápisků")
        getNotes()
    }, [])

    if (isLoading) {
        return (
            <>
                <h1>Generování</h1>
            </>
        )
    } else {
        return (
            <>
                <button
                    onClick={() => setCurrentScreen("home")}
                >Domů</button>
                <br />
                <h1>Zápisky</h1>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {notes}
                </ReactMarkdown>
            </>
        )
    }

}

export default NotesScreen