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

export function useCollection<T extends Record<string, any> & { id: string }>(
  collectionName: string,
  opts?: { orderBy?: keyof T & string; dir?: "desc" | "asc" }
) {
  const [data, setData] = useState<T[]>([])

  const typeConverter = {
    toFirestore(modelObject: WithFieldValue<T>): DocumentData {
      return { ...modelObject }
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
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
