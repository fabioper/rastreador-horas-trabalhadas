import React, { useCallback, useRef, useState } from "react"
import styles from "./OverlayMenu.module.scss"
import { IconType } from "react-icons"
import { Link } from "react-router-dom"
import { useOnClickOutside } from "usehooks-ts"

export interface OverlayMenuOption {
  icon: IconType
  label: string
  path?: string
  onClick?: () => Promise<void>
}

interface OverlayMenuProps {
  label?: string
  icon: IconType
  options: OverlayMenuOption[]
}

function OverlayMenu({ icon: Icon, label, options }: OverlayMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, () => setIsOpen(false))

  const optTemplate = useCallback(
    (opt: OverlayMenuOption) => {
      const OptIcon = opt.icon

      return (
        <>
          <OptIcon className={styles.overlayMenuOptionIcon} />
          <span className={styles.overlayMenuOptionLabel}>{opt.label}</span>
        </>
      )
    },
    [label, options, Icon]
  )

  return (
    <div
      className={styles.overlayMenu}
      onClick={() => setIsOpen((prevState) => !prevState)}
      ref={ref}
    >
      <div className={styles.overlayMenuHeader}>
        <i className={styles.overlayMenuHeaderIcon}>
          <Icon />
        </i>
        {!!label && (
          <span className={styles.overlayMenuHeaderLabel}>{label}</span>
        )}
      </div>

      {isOpen && (
        <ul className={styles.overlayMenuOptions}>
          {options.map((opt, index) => (
            <li
              key={index}
              className={styles.overlayMenuOption}
              onClick={opt.onClick}
            >
              {opt.path ? (
                <Link to={opt.path} className={styles.overlayMenuOptionLink}>
                  {optTemplate(opt)}
                </Link>
              ) : (
                optTemplate(opt)
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default OverlayMenu
