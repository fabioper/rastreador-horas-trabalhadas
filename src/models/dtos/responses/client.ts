import Model from "./model"

export default class Client extends Model<Client> {
  name: string

  constructor(props: Partial<Client>) {
    super(props)
    Object.assign(this, props)
  }
}
