export interface IDateProvider {
  dateNow(): Date
  addDays(date: Date, days: number): Date
}
