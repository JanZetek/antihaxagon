import { useState } from "react"

import HomeScreen from "./HomeScreen"
import SettingsScreen from "./SettingsScreen"
import SolutionScreen from "./SolutionScreen"

const App = () => {

    const [currentScreen, setCurrentScreen] = useState("home")
    const [models, setModels] = useState({})
    const [selectedModel, setSelectedModel] = useState("")

    if (currentScreen === "home") {
        return (
            <HomeScreen
                setCurrentScreen={setCurrentScreen}
                models={models}
                setModels={setModels}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
            />
        )
    }
    else if (currentScreen === "settings") {
        return (
            <SettingsScreen
                setCurrentScreen={setCurrentScreen}
            />
        )
    }
    else if (currentScreen === "solution") {
        return (
            <SolutionScreen
                setCurrentScreen={setCurrentScreen}
                models={models}
                selectedModel={selectedModel}
            />
        )
    }

}

export default App