import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const SolutionScreen = ({ setCurrentScreen, models, selectedModel }) => {
    
    const [solution, setSolution] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const getSolution = async () => {
        try {
            const [tab] = await chrome.tabs.query({
                active: true,
                lastFocusedWindow: true
            })

            if (!tab?.id) {
                throw new Error("Nepodařilo se načít kartu")
            }

            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },

                func: () => {
                    const forms = document.querySelectorAll("form")

                    return Array.from(forms, form => ({
                        paragraphs: Array.from(
                            form.querySelectorAll("p"),
                            p => p.innerText
                        )
                    }))
                }
            })

            const content = results[0]?.result

            if (!content) {
                throw new Error("Stránka nevrátila žádný obsah")
            }

            if (!content || content.length === 0) {
                throw new Error("Stránka nevrátila žádné otázky")
            }

            const modelConfig = models[selectedModel]

            console.log("Obsah stránky:", content)
            
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

            const answers = await Promise.all(
                content.map(async (question, index) => {
                    
                    // Zpracování otázek
                    const newQuestion = [...question.paragraphs]
                    newQuestion.splice(2, 1)
                    newQuestion.splice(0, 1)

                    let finalQuestion = ""
                    finalQuestion += `${index + 1}. Otázka: ${newQuestion[0]}`

                    newQuestion.splice(1).forEach((option, optionIndex) => {
                        finalQuestion += `${optionIndex + 1}. ${option}`
                    })

                    const response = await fetch(url, {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify({
                            model: selectedModel,
                            messages: [
                                {
                                    role: "system",
                                    content: "Na začátku vždy uveď tučně otázku a nabízené odpovědi. Pak velice krátce zdůvodníš, jaká je správná odpověď. Nakonec uvedeš tučně číslo odpovědi a její text."
                                },
                                {
                                    role: "user",
                                    content: finalQuestion
                                }
                            ],
                            stream: false
                        })
                    })

                    if (!response.ok) {
                        throw new Error("Chyba u otázky")
                    }

                    const result = await response.json()

                    const answer = result.choices?.[0].message?.content

                    if (!answer) {
                        throw new Error("Nevrátila se odpověď na otázku")
                    }

                    return answer
                })
            )               

            setSolution(answers)
            setIsLoading(false)

        } catch (e) {
            throw new Error(e)
        }
    }

    useEffect(() => {
        getSolution()
    }, [])
    
    if (isLoading === false) {
        return (
            <>
                <button
                    onClick={() => setCurrentScreen("home")}
                >Domů</button>
                <br />
                <h1>Řešení</h1>
                {solution.map(answer => (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {answer}
                    </ReactMarkdown>
                ))}
            </>
        )
    } else {
        return (
            <>
                <h1>Řešení se načítá</h1>
            </>
        )
    }

}

export default SolutionScreen