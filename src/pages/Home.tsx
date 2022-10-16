import React from "react"
import { useCollection } from "../hooks/useCollection"
import Card from "../shared/components/Card/Card"
import Button from "../shared/components/Button/Button"
import { FiPlusCircle } from "react-icons/fi"

export function Home() {
  const { data: clients } = useCollection<{ id: string; name: string }>("clients")

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">Clientes</h1>
          <Button icon={FiPlusCircle} kind="inline">
            Novo cliente
          </Button>
        </div>
      </header>

      <div>
        <div className="container">
          <div className="card-listing">
            {clients.map((client) => (
              <Card title={client.name} key={client.id} path="/" description={() => "Nenhum serviço cadastrado"} />
            ))}
          </div>

          {clients.length === 0 && <div>Nenhum cliente cadastrado</div>}
        </div>
      </div>
    </main>
  )
}
