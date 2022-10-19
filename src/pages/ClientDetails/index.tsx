import React from "react"
import { Navigate, Outlet, useParams } from "react-router-dom"
import useDocument from "../../hooks/useDocument"
import Client from "../../models/dtos/responses/client"
import Loader from "../../shared/components/Loader/Loader"

function ClientDetails() {
  const { clientId } = useParams<{ clientId: string }>()

  if (!clientId) {
    return <Navigate to="/" />
  }

  const { data: client } = useDocument<Client>("clients", clientId)

  if (!client) {
    return <Loader />
  }

  return <Outlet context={{ client }} />
}

export default ClientDetails
