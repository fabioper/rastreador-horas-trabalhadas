import React, { useMemo } from "react"
import styles from "./Button.module.scss"
import { IconType } from "react-icons"
import { Link } from "react-router-dom"
import { AiOutlineLoading3Quarters } from "react-icons/ai"

interface ButtonProps extends React.ButtonHTMLAttributes<any> {
  icon?: IconType
  kind?: "primary" | "inline" | "link" | "success" | "danger"
  to?: string
  children: JSX.Element | string
  loading?: boolean
  onClick?: () => any
}

export default function Button({
  icon: Icon,
  kind,
  to,
  disabled,
  children,
  loading,
  ...rest
}: ButtonProps) {
  const buttonClass = useMemo(() => {
    switch (kind) {
      case "inline":
        return styles.buttonInline
      case "primary":
        return styles.buttonPrimary
      case "success":
        return styles.buttonSuccess
      case "danger":
        return styles.buttonDanger
      case "link":
        return styles.buttonLink
      default:
        return styles.buttonPrimary
    }
  }, [kind])

  const isDisabled = useMemo(() => disabled || loading, [disabled, loading])

  const buttonContent = (
    <>
      <button
        {...rest}
        type={rest.type ?? "button"}
        disabled={isDisabled}
        className={`${buttonClass} ${Icon ? styles.hasIcon : ""} ${
          loading ? styles.loading : ""
        } ${rest.className ? rest.className : ""}`}
      >
        {Icon && !loading && <i className={styles.buttonIcon}>{<Icon />}</i>}
        {loading && (
          <i className={styles.buttonIcon}>{<AiOutlineLoading3Quarters />}</i>
        )}
        <span className={styles.buttonLabel}>{children}</span>
      </button>
    </>
  )

  if (to != null) {
    return (
      <Link to={to} className={styles.buttonLinkWrapper}>
        {buttonContent}
      </Link>
    )
  }

  return buttonContent
}
