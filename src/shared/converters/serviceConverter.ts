import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, WithFieldValue } from "firebase/firestore"
import Service from "../../models/dtos/responses/service"
import { WorkingInterval } from "../../models/dtos/responses/workingInterval"
import { LocalConverter } from "./localConverter"

export const serviceConverter: FirestoreDataConverter<Service> & LocalConverter<Service> = {
  fromLocal(id: string, obj: Service): Service {
    return new Service({
      ...obj,
      id,
      workingIntervals: obj.workingIntervals?.map((interval) => {
        return new WorkingInterval(interval.startDate, interval.endDate)
      }),
    })
  },
  toFirestore(modelObject: WithFieldValue<Service>): DocumentData {
    return { ...modelObject }
  },

  fromFirestore(snapshot: QueryDocumentSnapshot): Service {
    const serviceData = snapshot.data() as Service
    return this.fromLocal(snapshot.id, serviceData)
  },
}
