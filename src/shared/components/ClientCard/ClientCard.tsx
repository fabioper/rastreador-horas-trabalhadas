import React, { useMemo } from "react"
import Card from "../Card/Card"
import Client from "../../../models/dtos/responses/client"

interface ClientCardProps {
  client: Client
}

export default function ClientCard({ client }: ClientCardProps) {
  const clientCardBorderColor = "#2393ab"

  const description = useMemo(() => {
    return (
      <>
        <span className="counter">{client.totalHours}</span> horas registradas.
      </>
    )
  }, [client])

  return (
    <Card
      title={client.name}
      key={client.id}
      path={`/${client.id}`}
      description={description}
      borderColor={clientCardBorderColor}
    />
  )
}
