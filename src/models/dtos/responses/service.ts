import Model from "./model"
import { WorkingTimeRange } from "./workingTimeRange"

export default class Service extends Model<Service> {
  name: string
  hourValue: number
  estimatedHoursTotal?: number
  workingTimeRanges?: WorkingTimeRange[]
}
