import React from "react"
import styles from "./Counter.module.scss"
import { Duration } from "luxon"

interface CounterProps {
  total: number
}

function Counter({ total }: CounterProps) {
  return (
    <div className={styles.counterWrapper}>
      <span className={styles.counterTime}>
        {Duration.fromMillis(total).toFormat("hh:mm:ss")}
      </span>
    </div>
  )
}

export default Counter
