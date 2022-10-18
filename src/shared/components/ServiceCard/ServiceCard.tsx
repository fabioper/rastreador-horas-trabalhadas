import React, { useMemo } from "react"
import Card from "../Card/Card"
import Service from "../../../models/dtos/responses/service"
import Client from "../../../models/dtos/responses/client"

interface ServiceCardProps {
  service: Service
  client: Client
}

function ServiceCard({ client, service }: ServiceCardProps) {
  const clientCardBorderColor = "#CE9C1B"

  const description = useMemo(() => {
    return (
      <>
        <span className="counter">0</span> horas registradas.
      </>
    )
  }, [service])

  return (
    <Card
      title={service.name}
      key={service.id}
      path={`/${client.id}`}
      description={description}
      borderColor={clientCardBorderColor}
    />
  )
}

export default ServiceCard
