import React, { useMemo } from "react"
import styles from "./ServiceInfoGrid.module.scss"
import Service from "../../../models/dtos/responses/service"
import { Duration } from "luxon"
import { toCurrency } from "../../utils/formatter"

interface ServiceInfoGridProps {
  service: Service
  totalTime: number
}

function ServiceInfoGrid({ service, totalTime }: ServiceInfoGridProps) {
  const workedHours = useMemo(() => {
    const [hours, minutes] = Duration.fromMillis(totalTime).toFormat("hh:mm").split(":")
    return parseInt(minutes) > service.minimumMinutesToConsiderAnHour ? parseInt(hours) + 1 : parseInt(hours)
  }, [service, totalTime])

  const remainingHours = useMemo(() => {
    if (!service.estimatedHoursTotal) {
      return "-"
    }

    const remaining = service.estimatedHoursTotal - workedHours
    const duration = Duration.fromObject({ hours: remaining })
    return duration.toHuman()
  }, [service, totalTime])

  const totalValue = useMemo(() => {
    return toCurrency(service.hourValue * workedHours)
  }, [service, workedHours])

  return (
    <section className={styles.serviceInfoGrid}>
      <div className="container">
        <div className={styles.serviceInfo}>
          <p>Total de horas restantes:</p>
          <strong>{remainingHours}</strong>
        </div>

        <div className={styles.serviceInfo}>
          <p>Valor total até agora:</p>
          <strong>{totalValue}</strong>
        </div>
      </div>
    </section>
  )
}

export default ServiceInfoGrid
