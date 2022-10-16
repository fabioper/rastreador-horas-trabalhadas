import React from "react"
import { Route, Routes } from "react-router-dom"
import { Home } from "../pages/Home"
import { NewClient } from "../pages/NewClient"

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/novo-cliente" element={<NewClient />} />
    </Routes>
  )
}

export default Router
