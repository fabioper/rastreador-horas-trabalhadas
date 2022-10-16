import React from "react"
import Button from "../shared/components/Button/Button"

export function NewClient() {
  return (
    <main>
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">Novo Cliente</h1>
        </div>
      </header>

      <form className="form">
        <div className="container">
          <div className="form-control">
            <label htmlFor="name" className="form-label">
              Nome:
            </label>
            <input type="text" name="name" id="name" className="form-input" />
          </div>

          <Button type="submit" kind="success">
            Salvar novo cliente
          </Button>
        </div>
      </form>
    </main>
  )
}
