import { doc, FirestoreDataConverter, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react"
import Model from "../models/dtos/responses/model"
import { db } from "../services/firebase"
import { defaultConverter } from "../shared/converters/defaultConverter"

function useDocument<T extends Model<T>>(
  collectionName: string,
  documentId?: string,
  customConverter?: FirestoreDataConverter<T>
) {
  const [data, setData] = useState<T>()

  useEffect(() => {
    if (!documentId) {
      return
    }

    const document = doc(db, collectionName, documentId).withConverter<T>(
      customConverter ?? defaultConverter()
    )

    const unsubscribe = onSnapshot<T>(document, (doc) => {
      setData(doc.data())
    })

    return () => unsubscribe()
  }, [])

  return { data }
}

export default useDocument
