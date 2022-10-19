import React, { useEffect, useState } from "react"
import Button from "../shared/components/Button/Button"
import { useForm } from "../hooks/useForm"
import { object, string } from "yup"
import { useCollection } from "../hooks/useCollection"
import Client from "../models/dtos/responses/client"
import { useNavigate, useParams } from "react-router-dom"
import { MdCheck } from "react-icons/md"
import { useBackwardsPath } from "../shared/contexts/BackwardsContext"
import useDocument from "../hooks/useDocument"

interface NewClientRequest {
  name: string
}

export default function ManageClient() {
  const clientsCollection = useCollection<Client>("clients")
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const { clientId } = useParams<{ clientId: string }>()

  useBackwardsPath(clientId ? `/${clientId}` : "/")

  const { data: client } = useDocument<Client>("clients", clientId)

  const { form, field, isValid, displayErrorOf } = useForm<NewClientRequest>({
    initialValues: { name: "" },
    schema: object({
      name: string().required("Você deve informar o nome do cliente"),
    }),
    onSubmit,
  })

  useEffect(() => {
    if (client) {
      void form.setValues({ ...client })
    }
  }, [client])

  async function saveChanges(values: NewClientRequest): Promise<void> {
    if (!client) {
      await clientsCollection.save(values)
    } else {
      await clientsCollection.update(client.id, values)
    }
  }

  async function onSubmit(values: NewClientRequest) {
    setIsLoading(true)
    try {
      if (form.isValid) {
        await saveChanges(values)
        form.resetForm()
        navigate("/")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
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

          <Button
            type="submit"
            kind="success"
            disabled={!form.isValid}
            icon={MdCheck}
            loading={isLoading}
          >
            Salvar novo cliente
          </Button>
        </div>
      </form>
    </main>
  )
}
