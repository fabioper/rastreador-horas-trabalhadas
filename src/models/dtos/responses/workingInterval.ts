import { Timestamp } from "firebase/firestore"

export class WorkingInterval {
  startDate: Timestamp
  endDate?: Timestamp
}
