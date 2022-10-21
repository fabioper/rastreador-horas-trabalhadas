import React from "react"
import "./Counter.module.scss"
import { Duration } from "luxon"

interface CounterProps {
  total: number
}

function Counter({ total }: CounterProps) {
  return (
    <div>
      <span>{Duration.fromMillis(total).toFormat("hh:mm:ss")}</span>
    </div>
  )
}

export default Counter
