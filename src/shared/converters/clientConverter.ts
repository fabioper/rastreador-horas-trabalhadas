import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, WithFieldValue } from "firebase/firestore"
import Client from "../../models/dtos/responses/client"
import Service from "../../models/dtos/responses/service"
import { WorkingInterval } from "../../models/dtos/responses/workingInterval"
import { LocalConverter } from "./localConverter"

export const clientConverter: FirestoreDataConverter<Client> & LocalConverter<Client> = {
  fromLocal(id: string, obj: Client): Client {
    return new Client({
      ...obj,
      id,
      createdDate: obj.createdDate,
      name: obj.name,
      services: obj.services?.map((service) => {
        return new Service({
          ...service,
          id: service.id,
          workingIntervals: service.workingIntervals?.map((interval) => {
            return new WorkingInterval(interval.startDate, interval.endDate)
          }),
        })
      }),
    })
  },
  toFirestore(modelObject: WithFieldValue<Client>): DocumentData {
    return { ...modelObject }
  },

  fromFirestore(snapshot: QueryDocumentSnapshot): Client {
    const clientData = snapshot.data() as Client
    return this.fromLocal(snapshot.id, clientData)
  },
}
