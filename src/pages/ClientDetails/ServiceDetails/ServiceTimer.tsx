import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import Client from "../../../models/dtos/responses/client"
import Service from "../../../models/dtos/responses/service"
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi"
import { FaTrashAlt } from "react-icons/fa"
import { FiEdit } from "react-icons/fi"
import OverlayMenu from "../../../shared/components/OverlayMenu/OverlayMenu"
import { useCollection } from "../../../hooks/useCollection"
import { WorkingInterval } from "../../../models/dtos/responses/workingInterval"
import { Timestamp } from "firebase/firestore"
import Timer, { ServiceState } from "../../../shared/components/Counter/Timer"
import Button from "../../../shared/components/Button/Button"
import ServiceInfoGrid from "../../../shared/components/ServiceInfoGrid/ServiceInfoGrid"

function ServiceTimer() {
  const { client, service } = useOutletContext<{
    client: Client
    service: Service
  }>()

  const navigate = useNavigate()

  const { remove, update } = useCollection<Service>(
    `clients/${client.id}/services`
  )

  const [totalTime, setTotalTime] = useState(0)

  // prettier-ignore
  const currentWorkingTime = useMemo(() => service.mostRecentInterval, [service])

  // prettier-ignore
  const counterState = useMemo((): ServiceState => service.currentState, [currentWorkingTime])

  // prettier-ignore
  const serviceIntervals = useMemo(() => (
    service.workingIntervals?.map((interval) => ({
      startDate: interval.startDate,
      endDate: interval.endDate,
    })) ?? []
  ), [service.workingIntervals])

  // prettier-ignore
  const initInterval = useCallback((currentInterval: WorkingInterval) => {
    const intervalId = setInterval(() => {
      const currentTimeElapsed = new Date().getTime() - currentInterval.startDate.toDate().getTime()
      setTotalTime(service.totalTimeRegistered + currentTimeElapsed)
    }, 100)

    return () => {
      clearInterval(intervalId)
    }
  }, [currentWorkingTime])

  // prettier-ignore
  const initWorkingTime = useCallback(async (service: Service) => {
    const range = { startDate: Timestamp.now() } as WorkingInterval
    await update(service.id, { workingIntervals: [range] } as Service)
  }, [currentWorkingTime])

  // prettier-ignore
  const resumeWorkingTime = useCallback(async (service: Service) => {
    const range = { startDate: Timestamp.now() } as WorkingInterval
    await update(service.id, { workingIntervals: [...serviceIntervals, range] } as Service)
  }, [currentWorkingTime])

  // prettier-ignore
  const pauseWorkingTime = useCallback(async (service: Service) => {
    const range = { ...currentWorkingTime, endDate: Timestamp.now() } as WorkingInterval

    await update(service.id, {
      workingIntervals: serviceIntervals.map((workingRange) => {
        if (workingRange.startDate === currentWorkingTime?.startDate) {
          return range
        }

        return workingRange
      }),
    } as Service)
  }, [currentWorkingTime])

  useEffect(() => {
    const shouldSetInterval =
      service?.workingIntervals &&
      counterState === "running" &&
      currentWorkingTime

    if (shouldSetInterval) {
      return initInterval(currentWorkingTime)
    }

    setTotalTime(service.totalTimeRegistered)
  }, [currentWorkingTime])

  return (
    <main>
      <header className="page-header">
        <div className="container">
          <h1 className="page-title">{service.name}</h1>
          <OverlayMenu
            icon={HiOutlineDotsCircleHorizontal}
            options={[
              {
                label: "Editar serviço",
                icon: FiEdit,
                path: `/${client.id}/${service.id}/editar`,
              },
              {
                label: "Remover serviço",
                icon: FaTrashAlt,
                onClick: async () => {
                  await remove(service.id)
                  return navigate(`/${client.id}`)
                },
              },
            ]}
          />
          <p className="page-subtitle">
            Para:{" "}
            <Button kind="link" to={`/${client.id}`}>
              {client.name}
            </Button>
          </p>
        </div>
      </header>

      <ServiceInfoGrid service={service} totalTime={totalTime} />

      <div className="container">
        <Timer
          total={totalTime}
          state={counterState}
          onResume={async () => service && (await resumeWorkingTime(service))}
          onInit={async () => service && (await initWorkingTime(service))}
          onPause={async () => service && (await pauseWorkingTime(service))}
        />
      </div>
    </main>
  )
}

export default ServiceTimer
