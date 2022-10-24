import { Timestamp } from "firebase/firestore"
import { Interval } from "luxon"

export class WorkingInterval {
  startDate: Timestamp
  endDate?: Timestamp

  constructor(startDate: Timestamp, endDate?: Timestamp) {
    this.startDate = startDate
    this.endDate = endDate
  }

  get duration() {
    const start = this.startDate.toDate()
    const end = this.endDate?.toDate() ?? new Date()
    return Interval.fromDateTimes(start, end).toDuration()
  }

  get data(): WorkingInterval {
    return {
      startDate: this.startDate,
      endDate: this.endDate ?? null,
    } as WorkingInterval
  }

  static init() {
    return new WorkingInterval(Timestamp.now())
  }

  end() {
    this.endDate = Timestamp.now()
    return this
  }
}
