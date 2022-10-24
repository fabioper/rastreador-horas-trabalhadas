import {
  DocumentData,
  QueryDocumentSnapshot,
  WithFieldValue,
} from "firebase/firestore"
import Model from "../../models/dtos/responses/model"

export function defaultConverter<T extends Model<any>>() {
  return {
    toFirestore(modelObject: WithFieldValue<T>): DocumentData {
      return { ...modelObject }
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
      return { id: snapshot.id, ...snapshot.data() } as T
    },
  }
}
