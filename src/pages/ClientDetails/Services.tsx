import React from "react"
import Button from "../../shared/components/Button/Button"
import { FiEdit, FiPlusCircle } from "react-icons/fi"
import { useNavigate, useOutletContext } from "react-router-dom"
import { useCollection } from "../../hooks/useCollection"
import ServiceCard from "../../shared/components/ServiceCard/ServiceCard"
import Service from "../../models/dtos/responses/service"
import EmptyState from "../../shared/components/EmptyState/EmptyState"
import Client from "../../models/dtos/responses/client"
import OverlayMenu from "../../shared/components/OverlayMenu/OverlayMenu"
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi"
import { FaTrashAlt } from "react-icons/fa"
import { useBackwardsPath } from "../../shared/contexts/BackwardsContext"

export default function Services() {
  const { client } = useOutletContext<{ client: Client }>()
  const { remove } = useCollection<Client>("clients")
  const { data: services } = useCollection<Service>(
    `clients/${client.id}/services`
  )

  const navigate = useNavigate()

  useBackwardsPath(`/`)

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">{client.name}</h1>
          <OverlayMenu
            icon={HiOutlineDotsCircleHorizontal}
            options={[
              {
                label: "Editar cliente",
                icon: FiEdit,
                path: `/${client.id}/editar`,
              },
              {
                label: "Remover cliente",
                icon: FaTrashAlt,
                onClick: async () => {
                  await remove(client.id, "services")
                  return navigate("/")
                },
              },
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
            to={`/${client.id}/novo-servico`}
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
