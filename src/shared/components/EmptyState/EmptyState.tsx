import React from "react"
import emptyImage from "../../../assets/wind-turbine.svg"

interface EmptyStateProps {
  message: string
  visible: boolean
}

export default function EmptyState({ message, visible }: EmptyStateProps) {
  if (!visible) {
    return <></>
  }

  return (
    <div className="empty-state">
      <img src={emptyImage} alt="" className="empty-image" />
      <span>{message}</span>
    </div>
  )
}
