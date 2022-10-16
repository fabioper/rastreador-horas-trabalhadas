import React from "react"
import styles from "./Card.module.scss"
import { FiChevronRight } from "react-icons/fi"
import { Link } from "react-router-dom"

interface CardProps {
  title: string
  path: string
  description: () => string | JSX.Element
}

function Card({ title, path, description }: CardProps) {
  return (
    <Link to={path} className={styles.card}>
      <div className={styles.cardContent}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <div className={styles.cardDescription}>{description()}</div>
      </div>

      <i className={styles.chevronIcon}>
        <FiChevronRight />
      </i>
    </Link>
  )
}

export default Card
