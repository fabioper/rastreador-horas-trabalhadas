import React from "react"
import { useCollection } from "../hooks/useCollection"
import Button from "../shared/components/Button/Button"
import { FiPlusCircle } from "react-icons/fi"
import Client from "../models/dtos/responses/client"
import ClientCard from "../shared/components/ClientCard/ClientCard"
import EmptyState from "../shared/components/EmptyState/EmptyState"

export default function Clients() {
  const { data: clients } = useCollection<Client>("clients", {
    orderBy: "createdDate",
    dir: "desc",
  })

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
              <ClientCard key={client.id} client={client} />
            ))}
          </div>

          <EmptyState
            message="Nenhum cliente cadastrado"
            visible={clients.length === 0}
          />
        </div>
      </div>
    </main>
  )
}
