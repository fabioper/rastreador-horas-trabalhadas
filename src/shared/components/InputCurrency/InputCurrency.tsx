import React, { useCallback, useEffect, useMemo, useState } from "react"
import { toCurrency } from "../../utils/formatter"

interface InputCurrencyProps {
  id: string
  name: string
  value?: number
  disabled?: boolean
  readonly?: boolean
  className?: string
  autoFocus?: boolean
  onChange?: (value: number | undefined) => any
  onBlur?: React.FocusEventHandler<HTMLInputElement>
}

const InputCurrency: React.FC<InputCurrencyProps> = ({
  value,
  id,
  name,
  onChange,
  disabled,
  readonly,
  className,
  autoFocus,
  onBlur,
}) => {
  const [rawValue, setRawValue] = useState<number>(0)

  useEffect(() => {
    if (value !== undefined && value !== rawValue) {
      setRawValue(value)
    }
  }, [value])

  useEffect(() => {
    onChange?.(rawValue)
  }, [rawValue])

  const maskedValue = useMemo(() => {
    if (rawValue !== undefined && rawValue !== null) {
      return toCurrency(rawValue)
    }
  }, [rawValue])

  const stripNonNumericChars = (value: string) =>
    Number(value.replace(/\D/g, ""))

  const handleValueChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const value = stripNonNumericChars(ev.currentTarget.value)
      setRawValue(Number(value / 100))
    },
    []
  )

  return (
    <input
      id={id}
      name={name}
      autoComplete="off"
      type="tel"
      disabled={disabled}
      className={className}
      autoFocus={autoFocus}
      onBlur={onBlur}
      value={maskedValue}
      onChange={(ev) => handleValueChange(ev)}
      readOnly={readonly}
    />
  )
}

export default InputCurrency
