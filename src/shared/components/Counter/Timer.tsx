import React, { useMemo } from "react"
import styles from "./Timer.module.scss"
import { Duration } from "luxon"
import Button from "../Button/Button"
import { FaPlay } from "react-icons/fa"
import { MdPauseCircleFilled } from "react-icons/md"

export type CounterState = "running" | "paused" | "empty"

interface CounterProps {
  total: number
  state: CounterState
  onPause: () => any
  onResume: () => any
  onInit: () => any
}

function Timer({ total, state, onPause, onResume, onInit }: CounterProps) {
  const counterStyles = useMemo(() => {
    switch (state) {
      case "paused":
        return styles.counterPaused
      case "running":
        return styles.counterRunning
      default:
        return styles.counterEmpty
    }
  }, [state])

  const initButtonTemplate = (
    <Button onClick={onInit} icon={FaPlay} kind="success">
      Iniciar
    </Button>
  )

  const pauseButtonTemplate = (
    <Button onClick={onPause} icon={MdPauseCircleFilled} kind="danger">
      Pausar
    </Button>
  )

  const resumeButtonTemplate = (
    <Button onClick={onResume} icon={FaPlay} kind="success">
      Retomar
    </Button>
  )

  const buttonTemplate = useMemo(() => {
    if (state === "empty") {
      return initButtonTemplate
    }

    if (state === "paused") {
      return resumeButtonTemplate
    }

    if (state === "running") {
      return pauseButtonTemplate
    }
  }, [state])

  return (
    <div className={styles.counterContainer}>
      <div className={counterStyles}>
        <span className={styles.counterTime}>
          {Duration.fromMillis(total).toFormat("hh:mm:ss")}
        </span>
      </div>
      <div className={styles.timerButton}>{buttonTemplate}</div>
    </div>
  )
}

export default Timer
