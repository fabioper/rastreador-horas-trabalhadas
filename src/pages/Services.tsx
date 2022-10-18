import React from "react"
import Button from "../shared/components/Button/Button"
import { FiPlusCircle } from "react-icons/fi"
import { Navigate, useParams } from "react-router-dom"
import { useCollection } from "../hooks/useCollection"
import ServiceCard from "../shared/components/ServiceCard/ServiceCard"
import Service from "../models/dtos/responses/service"
import EmptyState from "../shared/components/EmptyState/EmptyState"

export default function Services() {
  const { clientId } = useParams<{ clientId: string }>()

  if (!clientId) {
    return <Navigate to="/" />
  }

  const { data: services } = useCollection<Service>(
    `clients/${clientId}/services`,
    {
      orderBy: "createdDate",
      dir: "desc",
    }
  )

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">Serviços</h1>
          <Button
            icon={FiPlusCircle}
            kind="inline"
            to={`/${clientId}/novo-servico`}
            style={{ color: "#CE9C1B" }}
          >
            Novo serviço
          </Button>
        </div>
      </header>

      <div>
        <div className="container">
          <div className="card-listing">
            {services.map((service) => (
              <ServiceCard
                clientId={clientId}
                service={service}
                key={service.id}
              />
            ))}
          </div>

          <EmptyState
            message="Nenhum serviço cadastrado"
            visible={services.length === 0}
          />
        </div>
      </div>
    </main>
  )
}
