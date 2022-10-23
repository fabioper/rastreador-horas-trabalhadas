import React, { useCallback, useEffect, useMemo, useState } from "react"
import useDocument from "../../hooks/useDocument"
import {
  Navigate,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom"
import Client from "../../models/dtos/responses/client"
import { useBackwardsPath } from "../../shared/contexts/BackwardsContext"
import Service from "../../models/dtos/responses/service"
import Loader from "../../shared/components/Loader/Loader"
import { HiOutlineDotsCircleHorizontal } from "react-icons/hi"
import { FaTrashAlt } from "react-icons/fa"
import { FiEdit } from "react-icons/fi"
import OverlayMenu from "../../shared/components/OverlayMenu/OverlayMenu"
import { useCollection } from "../../hooks/useCollection"
import { WorkingTimeRange } from "../../models/dtos/responses/workingTimeRange"
import { Timestamp } from "firebase/firestore"
import Counter, { CounterState } from "../../shared/components/Counter/Counter"

function ServiceDetails() {
  const { client } = useOutletContext<{ client: Client }>()
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()
  const { data: service } = useDocument<Service>(
    `clients/${client.id}/services`,
    serviceId
  )
  const { remove, update } = useCollection<Service>(
    `clients/${client.id}/services`
  )

  if (!serviceId) {
    return <Navigate to={`/${client.id}`} />
  }

  useBackwardsPath(`/${client.id}`)

  const [totalTime, setTotalTime] = useState(0)

  const currentWorkingTime = useMemo(() => {
    const ranges = service?.workingTimeRanges ?? []
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
      service?.workingTimeRanges
        ?.filter((range) => !!range.endDate)
        ?.map((range) => {
          const start = range.startDate.toDate()
          const end = range.endDate?.toDate() ?? new Date()
          return end.getTime() - start.getTime()
        })
        .reduce((a, b) => a + b, 0) ?? 0

    if (
      service?.workingTimeRanges &&
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
      const range = { startDate: Timestamp.now() } as WorkingTimeRange
      await update(service.id, { workingTimeRanges: [range] })
    },
    [currentWorkingTime]
  )

  const resumeWorkingTime = useCallback(
    async (service: Service) => {
      const workingRanges = service.workingTimeRanges ?? []
      const range = { startDate: Timestamp.now() } as WorkingTimeRange
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
      } as WorkingTimeRange

      const workingRanges = service.workingTimeRanges ?? []

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
                path: `/${client.id}/${serviceId}/editar`,
              },
              {
                label: "Remover serviço",
                icon: FaTrashAlt,
                onClick: async () => {
                  await remove(serviceId)
                  return navigate(`/${client.id}`)
                },
              },
            ]}
          />
        </div>
      </header>

      <div className="container">
        <Counter
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

export default ServiceDetails
