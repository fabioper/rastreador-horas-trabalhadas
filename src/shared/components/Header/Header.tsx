import { Link } from "react-router-dom"
import logo from "../../../assets/logo.svg"
import React from "react"
import styles from "./Header.module.scss"
import { useBackwardsContext } from "../../contexts/BackwardsContext"
import { MdArrowBack } from "react-icons/md"

function Header() {
  const { backwardsPath } = useBackwardsContext()

  return (
    <header className={styles.header}>
      <div className="container">
        {!!backwardsPath && (
          <Link to={backwardsPath} className={styles.backwardsLink}>
            <MdArrowBack />
          </Link>
        )}

        <Link to="/" className={styles.logo}>
          <img src={logo} alt="" />
        </Link>
      </div>
    </header>
  )
}

export default Header
