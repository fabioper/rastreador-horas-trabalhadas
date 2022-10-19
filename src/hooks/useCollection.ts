import { useCallback, useEffect, useState } from "react"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  updateDoc,
  WithFieldValue,
} from "firebase/firestore"
import { db } from "../services/firebase"
import Model from "../models/dtos/responses/model"

interface UseCollectionOpts<T extends Model<any>> {
  orderBy?: keyof T & string
  dir?: "desc" | "asc"
}

export function useCollection<T extends Model<any>>(
  collectionName: string,
  opts: UseCollectionOpts<T> = {
    orderBy: "createdDate",
    dir: "desc",
  }
) {
  const [data, setData] = useState<T[]>([])

  const collectionRef = collection(db, collectionName).withConverter<T>({
    toFirestore(modelObject: WithFieldValue<T>): DocumentData {
      return { ...modelObject }
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): T {
      return { id: snapshot.id, ...snapshot.data() } as T
    },
  })

  const mountQuery = useCallback(() => {
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

  async function save(doc: any) {
    await addDoc(collectionRef, { ...doc, createdDate: new Date() })
  }

  async function update(docId: string, data: any) {
    const ref = doc(db, collectionName, docId)
    await updateDoc(ref, { ...data })
  }

  async function remove(docId: string) {
    const foundDoc = doc(db, `${collectionName}/${docId}`)
    await deleteDoc(foundDoc)
  }

  return { data, save, remove, update }
}
