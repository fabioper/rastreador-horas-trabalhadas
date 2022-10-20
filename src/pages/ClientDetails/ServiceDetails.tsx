import React from "react"
import useDocument from "../../hooks/useDocument"
import {
  Navigate,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom"
import Client from "../../models/dtos/responses/client"
import { useBackwardsPath } from "../../shared/contexts/BackwardsContext"
import Service from "../../models/dtos/responses/service"
import Loader from "../../shared/components/Loader/Loader"
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi"
import { FaTrashAlt } from "react-icons/fa"
import { FiEdit } from "react-icons/fi"
import OverlayMenu from "../../shared/components/OverlayMenu/OverlayMenu"
import { useCollection } from "../../hooks/useCollection"

function ServiceDetails() {
  const { client } = useOutletContext<{ client: Client }>()
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()
  const { data: service } = useDocument<Service>(
    `clients/${client.id}/services`,
    serviceId
  )
  useBackwardsPath(`/${client.id}`)

  if (!serviceId) {
    return <Navigate to={`/${client.id}`} />
  }

  const { remove } = useCollection<Service>(`clients/${client.id}/services`)

  if (!service) {
    return <Loader />
  }

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">{service.name}</h1>
          <OverlayMenu
            icon={HiOutlineDotsCircleHorizontal}
            options={[
              {
                label: "Editar serviço",
                icon: FiEdit,
                path: `/${client.id}/${serviceId}/editar`,
              },
              {
                label: "Remover serviço",
                icon: FaTrashAlt,
                onClick: async () => {
                  await remove(serviceId)
                  return navigate(`/${client.id}`)
                },
              },
            ]}
          />
        </div>
      </header>
    </main>
  )
}

export default ServiceDetails
