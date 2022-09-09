import { format } from 'date-fns'

export function formatDate (dateString, pattern = 'dd MMM yyyy') {
  const localDate = new Date(dateString)
  const date = new Date(
    localDate.valueOf() + localDate.getTimezoneOffset() * 60 * 1000
  )
  return format(new Date(date), pattern)
}
