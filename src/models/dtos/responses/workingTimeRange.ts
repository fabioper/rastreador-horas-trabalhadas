import { Timestamp } from "firebase/firestore"

export class WorkingTimeRange {
  startDate: Timestamp
  endDate?: Timestamp
}
