import { Link } from "react-router-dom"
import logo from "../../../assets/logo.svg"
import React from "react"
import styles from "./Header.module.scss"

function Header() {
  return (
    <header className={styles.header}>
      <div className="container">
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="" />
        </Link>
      </div>
    </header>
  )
}

export default Header
