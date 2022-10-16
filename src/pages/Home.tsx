import React from "react"
import { useCollection } from "../hooks/useCollection"
import Card from "../shared/components/Card/Card"
import Button from "../shared/components/Button/Button"
import { FiPlusCircle } from "react-icons/fi"
import Client from "../models/dtos/responses/client"

export function Home() {
  const { data: clients } = useCollection<Client>("clients")

  function clientDescriptionTemplate(client: Client) {
    return () => (
      <>
        <span className="counter">0</span> horas registradas.
      </>
    )
  }

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">Clientes</h1>
          <Button icon={FiPlusCircle} kind="inline" to="novo-cliente">
            Novo cliente
          </Button>
        </div>
      </header>

      <div>
        <div className="container">
          <div className="card-listing">
            {clients.map((client) => (
              <Card title={client.name} key={client.id} path="/" description={clientDescriptionTemplate(client)} />
            ))}
          </div>

          {clients.length === 0 && <div>Nenhum cliente cadastrado</div>}
        </div>
      </div>
    </main>
  )
}
