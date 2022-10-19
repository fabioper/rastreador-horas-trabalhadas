import React from "react"
import { Route, Routes } from "react-router-dom"
import Loader from "../shared/components/Loader/Loader"

const Clients = React.lazy(async () => await import("../pages/Clients"))
const ManageClient = React.lazy(
  async () => await import("../pages/ManageClient")
)
const Services = React.lazy(async () => await import("../pages/Services"))
const ManageService = React.lazy(
  async () => await import("../pages/ManageService")
)

function Router() {
  return (
    <React.Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Clients />} />
        <Route path="/novo-cliente" element={<ManageClient />} />
        <Route path="/:clientId" element={<Services />} />
        <Route path="/:clientId/editar" element={<ManageClient />} />
        <Route path="/:clientId/novo-servico" element={<ManageService />} />
      </Routes>
    </React.Suspense>
  )
}

export default Router
