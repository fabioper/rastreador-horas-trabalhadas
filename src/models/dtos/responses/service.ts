import Model from "./model"
import { WorkingInterval } from "./workingInterval"

export default class Service extends Model<Service> {
  name: string
  hourValue: number
  estimatedHoursTotal?: number
  workingInterval?: WorkingInterval[]
}
