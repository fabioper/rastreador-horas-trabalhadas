import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  WithFieldValue,
} from "firebase/firestore"
import Client from "../../models/dtos/responses/client"

export const clientConverter: FirestoreDataConverter<Client> = {
  toFirestore(modelObject: WithFieldValue<Client>): DocumentData {
    return { ...modelObject }
  },

  fromFirestore(snapshot: QueryDocumentSnapshot): Client {
    const clientData = snapshot.data() as Client
    return new Client({
      ...clientData,
      id: snapshot.id,
      createdDate: clientData.createdDate,
      name: clientData.name,
    })
  },
}
