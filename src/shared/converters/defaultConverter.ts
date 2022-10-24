import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, WithFieldValue } from "firebase/firestore"
import Model from "../../models/dtos/responses/model"
import { LocalConverter } from "./localConverter"

export function defaultConverter<T extends Model<any>>(): FirestoreDataConverter<T> & LocalConverter<T> {
  return {
    fromLocal<T>(id: string, obj: T): T {
      return { id, ...obj }
    },
    toFirestore(modelObject: WithFieldValue<T>): DocumentData {
      return { ...modelObject }
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
      return { id: snapshot.id, ...snapshot.data() } as T
    },
  }
}
