import React from "react"
import Button from "../shared/components/Button/Button"
import { FiPlusCircle } from "react-icons/fi"
import { Navigate, useParams } from "react-router-dom"

export default function Services() {
  const { clientId } = useParams<{ clientId: string }>()

  if (!clientId) {
    return <Navigate to="/" />
  }
  return (
    <main>
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">Serviços</h1>
          <Button
            icon={FiPlusCircle}
            kind="inline"
            to={`/${clientId}/novo-servico`}
          >
            Novo serviço
          </Button>
        </div>
      </header>

      <div>
        <div className="container">
          <div className="card-listing"></div>
        </div>
      </div>
    </main>
  )
}
