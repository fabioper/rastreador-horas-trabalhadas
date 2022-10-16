import React from "react"
import Button from "../shared/components/Button/Button"
import { useForm } from "../hooks/useForm"
import { object, string } from "yup"
import { useCollection } from "../hooks/useCollection"
import Client from "../models/dtos/responses/client"
import { useNavigate } from "react-router-dom"

interface NewClientRequest {
  name: string
}

export function NewClient() {
  const clientsCollection = useCollection<Client>("clients")
  const navigate = useNavigate()

  const { form, field, isValid, displayErrorOf } = useForm<NewClientRequest>({
    initialValues: { name: "" },
    schema: object({
      name: string().required("Você deve informar o nome do cliente"),
    }),
    onSubmit,
  })

  async function onSubmit(values: NewClientRequest) {
    if (form.isValid) {
      await clientsCollection.save(values)
      form.resetForm()
      navigate("/")
    }
  }

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">Novo Cliente</h1>
        </div>
      </header>

      <form className="form" onSubmit={form.handleSubmit} autoComplete="off">
        <div className="container">
          <div className="form-control">
            <label htmlFor="name" className="form-label">
              Nome:
            </label>
            <input
              {...field("name")}
              className={`form-input ${!isValid("name") ? "invalid" : ""}`}
            />
            {displayErrorOf("name")}
          </div>

          <Button type="submit" kind="success" disabled={!form.isValid}>
            Salvar novo cliente
          </Button>
        </div>
      </form>
    </main>
  )
}
