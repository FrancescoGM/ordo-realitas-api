import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import utc from 'dayjs/plugin/utc'

import { IDateProvider } from '../models/IDateProvider'

dayjs.extend(utc)
dayjs.locale(ptBr)

export class DayjsDateProvider implements IDateProvider {
  dateNow(): Date {
    return dayjs().utc().local().toDate()
  }

  addDays(date: Date, days: number): Date {
    return dayjs(date).add(days, 'day').utc().local().toDate()
  }
}
