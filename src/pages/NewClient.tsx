import React from "react"
import Button from "../shared/components/Button/Button"
import { useForm } from "../hooks/useForm"
import { object, string } from "yup"

interface NewClientRequest {
  name: string
}

export function NewClient() {
  const { form, field, isValid, displayErrorOf } = useForm<NewClientRequest>({
    initialValues: { name: "" },
    schema: object({
      name: string().required("Você deve informar o nome do cliente"),
    }),
    onSubmit,
  })

  function onSubmit(values: NewClientRequest): void {
    console.log(values)
    form.resetForm()
  }

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">Novo Cliente</h1>
        </div>
      </header>

      <form className="form" onSubmit={form.handleSubmit}>
        <div className="container">
          <div className="form-control">
            <label htmlFor="name" className="form-label">
              Nome:
            </label>
            <input {...field("name")} className={`form-input ${!isValid("name") ? "invalid" : ""}`} />
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
