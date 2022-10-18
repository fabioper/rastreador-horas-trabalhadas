import {
  doc,
  DocumentData,
  onSnapshot,
  QueryDocumentSnapshot,
  WithFieldValue,
} from "firebase/firestore"
import { useEffect, useState } from "react"
import Model from "../models/dtos/responses/model"
import { db } from "../services/firebase"

function useDocument<T extends Model<T>>(
  collectionName: string,
  documentId: string
) {
  const [data, setData] = useState<T>()

  const document = doc(db, collectionName, documentId).withConverter<T>({
    toFirestore(modelObject: WithFieldValue<T>): DocumentData {
      return { ...modelObject }
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
      return { id: snapshot.id, ...snapshot.data() } as T
    },
  })

  useEffect(() => {
    const unsubscribe = onSnapshot<T>(document, (doc) => {
      setData(doc.data())
    })

    return () => unsubscribe()
  }, [])

  return { data }
}

export default useDocument
