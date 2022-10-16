import { useCallback, useEffect, useState } from "react"
import {
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  WithFieldValue,
} from "firebase/firestore"
import { db } from "../services/firebase"
import Model from "../models/dtos/responses/model"

export function useCollection<T extends Model<any>>(
  collectionName: string,
  opts?: { orderBy?: keyof T & string; dir?: "desc" | "asc" }
) {
  const [data, setData] = useState<T[]>([])

  const typeConverter = {
    toFirestore(modelObject: WithFieldValue<T>): DocumentData {
      return { ...modelObject }
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
      return { id: snapshot.id, ...snapshot.data() } as T
    },
  }

  const mountQuery = useCallback(() => {
    const collectionRef = collection(db, collectionName).withConverter<T>(typeConverter)

    let queries: QueryConstraint[] = []

    if (opts?.orderBy != null) {
      queries = [...queries, orderBy(opts.orderBy, opts.dir)]
    }

    return query(collectionRef, ...queries)
  }, [])

  useEffect(() => {
    const collectionQuery = mountQuery()

    const unsubscribe = onSnapshot<T>(collectionQuery, (result) => {
      setData(result.docs.map((doc) => doc.data()))
    })

    return () => unsubscribe()
  }, [])

  return { data }
}
