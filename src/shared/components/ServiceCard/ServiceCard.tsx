import React, { useMemo } from "react"
import Card from "../Card/Card"
import Service from "../../../models/dtos/responses/service"

interface ServiceCardProps {
  service: Service
  clientId: string
}

function ServiceCard({ clientId, service }: ServiceCardProps) {
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
      path={`/${clientId}/services/${service.id}`}
      description={description}
      borderColor={clientCardBorderColor}
    />
  )
}

export default ServiceCard
