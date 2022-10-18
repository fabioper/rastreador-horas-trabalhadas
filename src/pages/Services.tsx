import React from "react"
import Button from "../shared/components/Button/Button"
import { FiEdit, FiPlusCircle } from "react-icons/fi"
import { Navigate, useParams } from "react-router-dom"
import { useCollection } from "../hooks/useCollection"
import ServiceCard from "../shared/components/ServiceCard/ServiceCard"
import Service from "../models/dtos/responses/service"
import EmptyState from "../shared/components/EmptyState/EmptyState"
import useDocument from "../hooks/useDocument"
import Loader from "../shared/components/Loader/Loader"
import Client from "../models/dtos/responses/client"
import OverlayMenu from "../shared/components/OverlayMenu/OverlayMenu"
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi"
import { FaTrashAlt } from "react-icons/fa"

export default function Services() {
  const { clientId } = useParams<{ clientId: string }>()

  if (!clientId) {
    return <Navigate to="/" />
  }

  const { data: client } = useDocument<Client>("clients", clientId)

  const { data: services } = useCollection<Service>(
    `clients/${clientId}/services`
  )

  if (!client) {
    return <Loader />
  }

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">{client.name}</h1>
          <OverlayMenu
            icon={HiOutlineDotsCircleHorizontal}
            options={[
              { label: "Remover cliente", icon: FaTrashAlt },
              { label: "Editar cliente", icon: FiEdit },
            ]}
          />
        </div>
      </header>

      <div className="section-header">
        <div className="container">
          <h1 className="section-title">Serviços</h1>
          <Button
            icon={FiPlusCircle}
            kind="inline"
            to={`/${clientId}/novo-servico`}
            style={{ color: "#CE9C1B" }}
          >
            Novo serviço
          </Button>
        </div>
      </div>

      <div>
        <div className="container">
          <div className="card-listing">
            {services.map((service) => (
              <ServiceCard client={client} service={service} key={service.id} />
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
