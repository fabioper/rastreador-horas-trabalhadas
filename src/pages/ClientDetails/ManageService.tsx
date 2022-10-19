import React, { useEffect, useMemo, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import Client from "../../models/dtos/responses/client"
import { useForm } from "../../hooks/useForm"
import { MdCheck } from "react-icons/md"
import Button from "../../shared/components/Button/Button"
import InputCurrency from "../../shared/components/InputCurrency/InputCurrency"
import { useCollection } from "../../hooks/useCollection"
import { number, object, string } from "yup"
import { useBackwardsPath } from "../../shared/contexts/BackwardsContext"
import useDocument from "../../hooks/useDocument"
import Service from "../../models/dtos/responses/service"

interface ManageServiceRequest {
  name: string
  hourValue: number
  estimatedHoursTotal?: number
}

function ManageService() {
  const { client } = useOutletContext<{ client: Client }>()
  const [loading, setLoading] = useState(false)
  const { save, update } = useCollection(`clients/${client.id}/services`)
  const navigate = useNavigate()
  const { serviceId } = useParams<{ serviceId: string }>()

  const { data: service } = useDocument<Service>(
    `clients/${client.id}/services`,
    serviceId
  )

  const { form, field, displayErrorOf, isValid } =
    useForm<ManageServiceRequest>({
      initialValues: {
        name: "",
        estimatedHoursTotal: 0,
        hourValue: 0,
      },
      schema: object({
        name: string().required("É obrigatório informar o nome do serviço"),
        hourValue: number().required(
          "Informe o valor cobrado por hora para este serviço"
        ),
        estimatedHoursTotal: number().optional(),
      }),
      onSubmit,
    })

  useEffect(() => {
    if (service) {
      void form.setValues({ ...service })
    }
  }, [service])

  useBackwardsPath(service ? `/${client.id}/${service.id}` : `/${client.id}`)

  async function saveChanges(values: ManageServiceRequest): Promise<void> {
    if (!service) {
      await save(values)
    } else {
      await update(service.id, values)
    }
  }

  async function onSubmit(values: ManageServiceRequest) {
    setLoading(true)
    try {
      if (client && form.isValid) {
        await saveChanges(values)
        form.resetForm()
        navigate(service ? `/${client.id}/${service.id}` : `/${client.id}`)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const estimatedTotalBudget = useMemo(() => {
    return form.values.hourValue * (form.values.estimatedHoursTotal ?? 0)
  }, [form.values.hourValue, form.values.estimatedHoursTotal])

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">Novo Serviço</h1>
          <p className="page-subtitle">
            Para:{" "}
            <Button kind="link" to={`/${client.id}`}>
              {client.name}
            </Button>
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
              value={form.values.hourValue}
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

          <div className="form-control">
            <label htmlFor="estimatedTotalBudget" className="form-label">
              Estimativa de total à receber:
            </label>
            <InputCurrency
              readonly
              id="estimatedTotalBudget"
              name="estimatedTotalBudget"
              value={estimatedTotalBudget}
              className="form-input"
            />
          </div>

          <Button
            type="submit"
            kind="success"
            disabled={!form.isValid}
            icon={MdCheck}
            loading={loading}
          >
            {service ? "Atualizar serviço" : "Salvar novo serviço"}
          </Button>
        </div>
      </form>
    </main>
  )
}

export default ManageService
