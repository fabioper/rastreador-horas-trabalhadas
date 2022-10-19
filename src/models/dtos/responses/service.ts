import Model from "./model"

export default class Service extends Model<Service> {
  name: string
  hourValue: number
  estimatedHoursTotal?: number
}
