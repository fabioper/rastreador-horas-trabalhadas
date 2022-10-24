import Model from "./model"
import { WorkingInterval } from "./workingInterval"

export default class Service extends Model<Service> {
  name: string
  hourValue: number
  estimatedHoursTotal?: number
  workingIntervals?: WorkingInterval[]

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
}
