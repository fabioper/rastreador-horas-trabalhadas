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
import { FaPlay, FaTrashAlt } from "react-icons/fa"
import { FiEdit } from "react-icons/fi"
import OverlayMenu from "../../shared/components/OverlayMenu/OverlayMenu"
import { useCollection } from "../../hooks/useCollection"
import Button from "../../shared/components/Button/Button"
import { WorkingTimeRange } from "../../models/dtos/responses/workingTimeRange"
import { AiFillPauseCircle } from "react-icons/ai"
import { Timestamp } from "firebase/firestore"
import Counter from "../../shared/components/Counter/Counter"

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

  const neverInitiated = useMemo(
    () => !currentWorkingTime,
    [currentWorkingTime]
  )
  const isRunning = useMemo(
    () => !currentWorkingTime?.endDate,
    [currentWorkingTime]
  )
  const isPaused = useMemo(
    () => !neverInitiated && !isRunning,
    [currentWorkingTime]
  )

  useEffect(() => {
    const timeUntilNow =
      service?.workingTimeRanges
        ?.filter((range) => !!range.endDate)
        ?.map((range) => {
          const start = range.startDate.toDate()
          const end = range.endDate?.toDate() ?? new Date()
          return end.getTime() - start.getTime()
        })
        .reduce((a, b) => a + b) ?? 0

    if (service?.workingTimeRanges && isRunning && currentWorkingTime) {
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

  const initButtonTemplate = (
    <Button onClick={() => service && initWorkingTime(service)} icon={FaPlay}>
      Iniciar
    </Button>
  )

  const pauseButtonTemplate = (
    <Button
      onClick={() => service && pauseWorkingTime(service)}
      icon={AiFillPauseCircle}
    >
      Pausar
    </Button>
  )

  const resumeButtonTemplate = (
    <Button onClick={() => service && resumeWorkingTime(service)} icon={FaPlay}>
      Retomar
    </Button>
  )

  const buttonTemplate = useMemo(() => {
    if (neverInitiated) {
      return initButtonTemplate
    }

    if (isRunning) {
      return pauseButtonTemplate
    }

    if (isPaused) {
      return resumeButtonTemplate
    }
  }, [service, currentWorkingTime])

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
        <Counter total={totalTime} />
        <div>{buttonTemplate}</div>
      </div>
    </main>
  )
}

export default ServiceDetails
