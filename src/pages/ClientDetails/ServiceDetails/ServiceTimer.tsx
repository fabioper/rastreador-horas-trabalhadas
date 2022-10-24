import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import Client from "../../../models/dtos/responses/client"
import Service from "../../../models/dtos/responses/service"
import Loader from "../../../shared/components/Loader/Loader"
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi"
import { FaTrashAlt } from "react-icons/fa"
import { FiEdit } from "react-icons/fi"
import OverlayMenu from "../../../shared/components/OverlayMenu/OverlayMenu"
import { useCollection } from "../../../hooks/useCollection"
import { WorkingInterval } from "../../../models/dtos/responses/workingInterval"
import { Timestamp } from "firebase/firestore"
import Timer, { CounterState } from "../../../shared/components/Counter/Timer"
import Button from "../../../shared/components/Button/Button"
import ServiceInfoGrid from "../../../shared/components/ServiceInfoGrid/ServiceInfoGrid"
import { Interval } from "luxon"

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

  const currentWorkingTime = useMemo(() => {
    const ranges = service?.workingInterval ?? []
    return ranges.at(-1)
  }, [service])

  const counterState = useMemo((): CounterState => {
    if (!currentWorkingTime) {
      return "empty"
    }

    if (currentWorkingTime?.endDate) {
      return "paused"
    }

    return "running"
  }, [currentWorkingTime])

  useEffect(() => {
    const timeUntilNow =
      service?.workingInterval
        ?.filter((range) => !!range.endDate)
        ?.map((range) => {
          const start = range.startDate.toDate()
          const end = range.endDate?.toDate() ?? new Date()
          return Interval.fromDateTimes(start, end).toDuration().milliseconds
        })
        .reduce((a, b) => a + b, 0) ?? 0

    if (
      service?.workingInterval &&
      counterState === "running" &&
      currentWorkingTime
    ) {
      const intervalId = setInterval(() => {
        setTotalTime(
          timeUntilNow +
            (new Date().getTime() -
              currentWorkingTime.startDate.toDate().getTime())
        )
      }, 100)

      return () => {
        clearInterval(intervalId)
      }
    }

    setTotalTime(timeUntilNow)
  }, [currentWorkingTime])

  const initWorkingTime = useCallback(
    async (service: Service) => {
      const range = { startDate: Timestamp.now() } as WorkingInterval
      await update(service.id, { workingTimeRanges: [range] })
    },
    [currentWorkingTime]
  )

  const resumeWorkingTime = useCallback(
    async (service: Service) => {
      const workingRanges = service.workingInterval ?? []
      const range = { startDate: Timestamp.now() } as WorkingInterval
      await update(service.id, {
        ...service,
        workingTimeRanges: [...workingRanges, range],
      })
    },
    [currentWorkingTime]
  )

  const pauseWorkingTime = useCallback(
    async (service: Service) => {
      const range = {
        ...currentWorkingTime,
        endDate: Timestamp.now(),
      } as WorkingInterval

      const workingRanges = service.workingInterval ?? []

      await update(service.id, {
        workingTimeRanges: workingRanges.map((workingRange) => {
          if (workingRange.startDate === currentWorkingTime?.startDate) {
            return range
          }

          return workingRange
        }),
      })
    },
    [currentWorkingTime]
  )

  if (!service) {
    return <Loader />
  }

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
