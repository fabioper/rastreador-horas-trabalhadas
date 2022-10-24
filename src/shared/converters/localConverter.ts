import Model from "../../models/dtos/responses/model"

export interface LocalConverter<T extends Model<T>> {
  fromLocal: (id: string, obj: T) => T
}
