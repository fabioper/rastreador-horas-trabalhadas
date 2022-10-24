import React from "react"
import { Navigate, Outlet, useOutletContext, useParams } from "react-router-dom"
import Client from "../../../models/dtos/responses/client"
import useDocument from "../../../hooks/useDocument"
import Service from "../../../models/dtos/responses/service"
import { useBackwardsPath } from "../../../shared/contexts/BackwardsContext"
import { serviceConverter } from "../../../shared/converters/serviceConverter"
import Loader from "../../../shared/components/Loader/Loader"

function ServiceDetails() {
  const { client } = useOutletContext<{ client: Client }>()
  const { serviceId } = useParams<{ serviceId: string }>()
  useBackwardsPath(`/${client.id}`)

  if (!serviceId) {
    return <Navigate to={`/${client.id}`} />
  }

  const { data: service } = useDocument<Service>(
    `clients/${client.id}/services`,
    serviceId,
    serviceConverter
  )

  if (!service) {
    return <Loader />
  }

  return <Outlet context={{ client, service }} />
}

export default ServiceDetails
