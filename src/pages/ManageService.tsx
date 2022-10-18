import React, { useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import useDocument from "../hooks/useDocument"
import Client from "../models/dtos/responses/client"
import Loader from "../shared/components/Loader/Loader"
import { useForm } from "../hooks/useForm"
import { MdCheck } from "react-icons/md"
import Button from "../shared/components/Button/Button"
import InputCurrency from "../shared/components/InputCurrency/InputCurrency"
import { useCollection } from "../hooks/useCollection"
import { number, object, string } from "yup"

interface ManageServiceRequest {
  name: string
  hourValue: number
  estimatedHoursTotal?: number
}

function ManageService() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const { clientId } = useParams<{ clientId: string }>()

  if (!clientId) {
    return <Navigate to="/" />
  }

  const { data: client } = useDocument<Client>("clients", clientId)
  const { save } = useCollection(`clients/${clientId}/services`)

  const { form, field, displayErrorOf, isValid } =
    useForm<ManageServiceRequest>({
      schema: object({
        name: string().required("É obrigatório informar o nome do serviço"),
        hourValue: number().required(
          "Informe o valor cobrado por hora para este serviço"
        ),
        estimatedHoursTotal: number().optional(),
      }),
      onSubmit,
    })

  async function onSubmit(values: ManageServiceRequest) {
    setLoading(true)
    try {
      if (clientId && form.isValid) {
        await save(values)
        form.resetForm()
        navigate(`/${clientId}`)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (!client) {
    return <Loader />
  }

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">Novo Serviço</h1>
          <p className="page-subtitle">
            Para cliente: <span className="client-name">{client.name}</span>
          </p>
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

          <div className="form-control">
            <label htmlFor="hourValue" className="form-label">
              Valor por hora:
            </label>
            <InputCurrency
              id="hourValue"
              name="hourValue"
              onChange={async (value) =>
                await form.setFieldValue("hourValue", value)
              }
              onBlur={form.handleBlur}
              className={`form-input ${!isValid("hourValue") ? "invalid" : ""}`}
            />
            {displayErrorOf("hourValue")}
          </div>

          <div className="form-control">
            <label htmlFor="estimatedHoursTotal" className="form-label">
              Total de horas estimadas:
            </label>
            <input
              {...field("estimatedHoursTotal")}
              type="number"
              className={`form-input ${
                !isValid("estimatedHoursTotal") ? "invalid" : ""
              }`}
            />
            {displayErrorOf("estimatedHoursTotal")}
          </div>

          <Button
            type="submit"
            kind="success"
            disabled={!form.isValid}
            icon={MdCheck}
            loading={loading}
          >
            Salvar novo serviço
          </Button>
        </div>
      </form>
    </main>
  )
}

export default ManageService
