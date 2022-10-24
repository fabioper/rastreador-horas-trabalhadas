import { useCallback, useEffect, useMemo, useState } from "react"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  FirestoreDataConverter,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  updateDoc,
} from "firebase/firestore"
import { db } from "../services/firebase"
import Model from "../models/dtos/responses/model"
import { defaultConverter } from "../shared/converters/defaultConverter"
import { LocalConverter } from "../shared/converters/localConverter"

interface UseCollectionOpts<T extends Model<any>> {
  orderBy?: keyof T & string
  dir?: "desc" | "asc"
  customConverter?: FirestoreDataConverter<T> & LocalConverter<T>
  include?: Array<keyof T> & string[]
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

  const converter = useMemo((): FirestoreDataConverter<T> & LocalConverter<T> => {
    return opts.customConverter ?? defaultConverter()
  }, [opts.customConverter])

  const collectionRef = collection(db, collectionName).withConverter<T>(converter)

  async function save(doc: any) {
    await addDoc(collectionRef, { ...doc, createdDate: new Date() })
  }

  async function update(docId: string, data: any) {
    const ref = doc(db, collectionName, docId).withConverter(converter)
    await updateDoc(ref, { ...data })
  }

  async function remove(docId: string, ...subCollections: string[]) {
    const foundDoc = doc(db, `${collectionName}/${docId}`)

    if (subCollections.length > 0) {
      for (const subCollection of subCollections) {
        const subCollectionRef = collection(db, collectionName, foundDoc.id, subCollection).withConverter<T>(converter)

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

  function includeSubCollections(data: Array<QueryDocumentSnapshot<T>>) {
    return data.map(async (doc) => {
      let copy = { ...doc.data() }
      for (const subCollectionName of opts.include ?? []) {
        const subCollection = await getDocs(collection(db, collectionName, doc.id, subCollectionName))
        copy = {
          ...copy,
          [subCollectionName]: subCollection.docs.map((doc) => doc.data()),
        }
      }
      return converter.fromLocal(doc.id, copy)
    })
  }

  useEffect(() => {
    const collectionQuery = mountQuery()

    const unsubscribe = onSnapshot<T>(collectionQuery, (result) => {
      const data = result.docs

      if (opts.include && opts.include.length > 0) {
        const includedSubCollections = includeSubCollections(data)
        Promise.all(includedSubCollections).then(setData).catch(console.error)
      } else {
        setData(data.map((doc) => doc.data()))
      }
    })

    return () => unsubscribe()
  }, [])

  return { data, save, remove, update }
}
