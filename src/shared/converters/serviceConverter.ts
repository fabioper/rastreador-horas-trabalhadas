import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  WithFieldValue,
} from "firebase/firestore"
import Service from "../../models/dtos/responses/service"
import { WorkingInterval } from "../../models/dtos/responses/workingInterval"

export const serviceConverter: FirestoreDataConverter<Service> = {
  toFirestore(modelObject: WithFieldValue<Service>): DocumentData {
    return { ...modelObject }
  },

  fromFirestore(snapshot: QueryDocumentSnapshot): Service {
    const serviceData = snapshot.data() as Service
    return new Service({
      ...serviceData,
      id: snapshot.id,
      workingIntervals: serviceData.workingIntervals?.map((interval) => {
        return new WorkingInterval(interval.startDate, interval.endDate)
      }),
    })
  },
}
