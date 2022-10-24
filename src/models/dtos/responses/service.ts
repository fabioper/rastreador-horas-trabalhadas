import Model from "./model"
import { WorkingInterval } from "./workingInterval"
import { Duration } from "luxon"

export default class Service extends Model<Service> {
  name: string
  hourValue: number
  estimatedHoursTotal?: number
  workingIntervals?: WorkingInterval[]
  minimumMinutesToConsiderAnHour = 45

  constructor(props: Partial<Service>) {
    super(props)
    Object.assign(this, props)
  }

  get currentState() {
    if (!this.workingIntervals) {
      return "empty"
    }

    if (this.mostRecentInterval?.endDate) {
      return "paused"
    }

    return "running"
  }

  get mostRecentInterval() {
    return this.workingIntervals?.at(-1)
  }

  get totalTimeRegistered() {
    return (
      this.workingIntervals
        ?.filter((interval) => !!interval.endDate)
        ?.map((interval) => interval.duration.milliseconds)
        .reduce((a, b) => a + b, 0) ?? 0
    )
  }

  get workedHours() {
    const [hours, minutes] = Duration.fromMillis(this.totalTimeRegistered).toFormat("hh:mm").split(":")
    return parseInt(minutes) > this.minimumMinutesToConsiderAnHour ? parseInt(hours) + 1 : parseInt(hours)
  }
}
