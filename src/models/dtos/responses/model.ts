export default abstract class Model<T> {
  id: string
  createdDate: Date

  constructor(props: Partial<T>) {
    Object.assign(this, props)
  }
}
