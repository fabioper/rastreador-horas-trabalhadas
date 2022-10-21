import { useCallback, useEffect, useMemo, useState } from "react"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  FirestoreDataConverter,
  getDocs,
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

  const mountQuery = useCallback(() => {
    let queries: QueryConstraint[] = []

    if (opts?.orderBy != null) {
      queries = [...queries, orderBy(opts.orderBy, opts.dir)]
    }

    return query(collectionRef, ...queries)
  }, [])

  const converter = useMemo(
    (): FirestoreDataConverter<T> => ({
      toFirestore(modelObject: WithFieldValue<T>): DocumentData {
        return { ...modelObject }
      },
      fromFirestore(snapshot: QueryDocumentSnapshot): T {
        return { id: snapshot.id, ...snapshot.data() } as T
      },
    }),
    []
  )

  const collectionRef = collection(db, collectionName).withConverter<T>(
    converter
  )

  async function save(doc: any) {
    await addDoc(collectionRef, { ...doc, createdDate: new Date() })
  }

  /* function removeEmptyFields(data: object) {
    return Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    )
  } */

  async function update(docId: string, data: any) {
    const ref = doc(db, collectionName, docId)
    await updateDoc(ref, { ...data })
  }

  async function remove(docId: string, ...subCollections: string[]) {
    const foundDoc = doc(db, `${collectionName}/${docId}`)

    if (subCollections.length > 0) {
      for (const subCollection of subCollections) {
        const subCollectionRef = collection(
          db,
          collectionName,
          foundDoc.id,
          subCollection
        ).withConverter<T>(converter)

        const { docs: subCollectionDocs } = await getDocs<T>(subCollectionRef)

        await Promise.all(
          subCollectionDocs.map(async (doc) => {
            await deleteDoc(doc.ref)
          })
        )
      }
    }

    await deleteDoc(foundDoc)
  }

  useEffect(() => {
    const collectionQuery = mountQuery()

    const unsubscribe = onSnapshot<T>(collectionQuery, (result) => {
      setData(result.docs.map((doc) => doc.data()))
    })

    return () => unsubscribe()
  }, [])

  return { data, save, remove, update }
}
