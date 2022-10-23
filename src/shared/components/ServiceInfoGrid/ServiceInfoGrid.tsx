import React, { useMemo } from "react"
import styles from "./ServiceInfoGrid.module.scss"
import Service from "../../../models/dtos/responses/service"
import { Duration } from "luxon"

interface ServiceInfoGridProps {
  service: Service
  totalTime: number
}

function toCurrency(value: number) {
  const currencyOptions = { style: "currency", currency: "BRL" }
  const currencyFormatter = new Intl.NumberFormat("pt-BR", currencyOptions)
  return currencyFormatter.format(value)
}

function ServiceInfoGrid({ service, totalTime }: ServiceInfoGridProps) {
  const workedHours = useMemo(() => {
    return parseInt(Duration.fromMillis(totalTime).toFormat("hh"))
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
