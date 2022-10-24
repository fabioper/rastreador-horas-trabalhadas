export function toCurrency(value: number) {
  const currencyOptions = { style: "currency", currency: "BRL" }
  const currencyFormatter = new Intl.NumberFormat("pt-BR", currencyOptions)
  return currencyFormatter.format(value)
}
