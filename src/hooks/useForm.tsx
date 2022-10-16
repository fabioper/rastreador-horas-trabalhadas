import { FormikErrors, FormikValues, useFormik } from "formik"
import { SchemaOf } from "yup"
import React from "react"
import { BsExclamationCircle } from "react-icons/bs"

interface UseFormParams<T> {
  onSubmit: (values: T) => void
  schema?: SchemaOf<T>
  initialValues?: Partial<T>
  validate?: (values: T) => FormikErrors<T>
}

export interface UseFormField {
  id: string
  name: string
  value: string
  onChange: React.ChangeEventHandler
  onBlur: React.FocusEventHandler
}

export function useForm<T extends FormikValues>({ onSubmit, schema, initialValues, validate }: UseFormParams<T>) {
  const form = useFormik<T>({
    initialValues: initialValues != null ? (initialValues as T) : ({} as T),
    validationSchema: schema,
    onSubmit,
    validateOnMount: false,
    validate,
  })

  const isValid = (field: keyof T): boolean => !form.touched[field] || !form.errors[field]

  const displayErrorOf = (name: keyof T) =>
    !isValid(name) && (
      <small className="form-error">
        <BsExclamationCircle /> {form.errors[name]?.toString()}
      </small>
    )

  const field = (field: keyof T): UseFormField => ({
    id: field.toString(),
    name: field.toString(),
    value: (form.values[field] as any) || "",
    onChange: form.handleChange,
    onBlur: form.handleBlur,
  })

  return { form, isValid, displayErrorOf, field }
}
