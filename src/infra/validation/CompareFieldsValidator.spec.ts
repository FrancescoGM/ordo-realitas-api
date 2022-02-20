import { CompareFieldsValidator } from './CompareFieldsValidator'

describe('Compare fields validator', () => {
  const validator = new CompareFieldsValidator('field', 'field_to_compare')

  it('Should return no errors if receive both equal values', () => {
    const result = validator.validate({
      field: 'value',
      field_to_compare: 'value',
    })

    expect(result.isRight()).toBeTruthy()
  })

  it('Should return error if receive different values', () => {
    const result = validator.validate({
      field: 'value',
      field_to_compare: 'different_value',
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
