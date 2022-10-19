import React from "react"
import useDocument from "../../hooks/useDocument"
import { Navigate, useOutletContext, useParams } from "react-router-dom"
import Client from "../../models/dtos/responses/client"
import { useBackwardsPath } from "../../shared/contexts/BackwardsContext"
import Service from "../../models/dtos/responses/service"
import Loader from "../../shared/components/Loader/Loader"

function ServiceDetails() {
  const { client } = useOutletContext<{ client: Client }>()
  const { serviceId } = useParams<{ serviceId: string }>()
  const { data: service } = useDocument<Service>(
    `clients/${client.id}/services`,
    serviceId
  )
  useBackwardsPath(`/${client.id}`)

  if (!serviceId) {
    return <Navigate to={`/${client.id}`} />
  }

  if (!service) {
    return <Loader />
  }

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">{service.name}</h1>
        </div>
      </header>
    </main>
  )
}

export default ServiceDetails
