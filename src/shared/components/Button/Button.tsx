import React, { useMemo } from "react"
import styles from "./Button.module.scss"
import { IconType } from "react-icons"
import { Link } from "react-router-dom"

interface ButtonProps extends React.ButtonHTMLAttributes<any> {
  icon?: IconType
  kind?: "primary" | "inline"
  to?: string
  children: JSX.Element | string
}

export default function Button({ icon: Icon, kind, to, children, ...rest }: ButtonProps) {
  const buttonClass = useMemo(() => {
    switch (kind) {
      case "inline":
        return styles.buttonInline
      case "primary":
        return styles.buttonPrimary
      default:
        return styles.button
    }
  }, [kind])

  const buttonContent = (
    <>
      <button {...rest} type={rest.type ?? "button"} className={buttonClass}>
        {!(Icon === undefined) && <i className={styles.buttonIcon}>{<Icon />}</i>}
        <span className={styles.buttonLabel}>{children}</span>
      </button>
    </>
  )

  if (to != null) {
    return (
      <Link to={to} className={styles.buttonLink}>
        {buttonContent}
      </Link>
    )
  }

  return buttonContent
}
