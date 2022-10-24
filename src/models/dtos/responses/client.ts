import Model from "./model"
import Service from "./service"

export default class Client extends Model<Client> {
  name: string
  services?: Service[]

  constructor(props: Partial<Client>) {
    super(props)
    Object.assign(this, props)
  }

  get totalHours() {
    if (!this.services) {
      return 0
    }

    return this.services.reduce((a, b) => a + b.workedHours, 0)
  }
}
