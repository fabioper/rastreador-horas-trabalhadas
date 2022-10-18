import React from "react"
import Router from "./routes"
import Header from "./shared/components/Header/Header"
import BackwardsProvider from "./shared/contexts/BackwardsContext"

function App() {
  return (
    <BackwardsProvider>
      <div className="App">
        <Header />
        <Router />
      </div>
    </BackwardsProvider>
  )
}

export default App
