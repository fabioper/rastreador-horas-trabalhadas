import React from "react"
import logo from "./assets/logo.svg"
import { useCollection } from "./hooks/useCollection"

function App() {
  const { data } = useCollection<{ id: string; name: string }>("clients")

  return (
    <div className="App">
      <header>
        <div className="container">
          <img src={logo} alt="" className="logo" />
        </div>
      </header>

      <div>
        {data.map((client) => (
          <div key={client.id}>{client.name}</div>
        ))}

        {data.length === 0 && <div>Nenhum cliente cadastrado</div>}
      </div>
    </div>
  )
}

export default App
