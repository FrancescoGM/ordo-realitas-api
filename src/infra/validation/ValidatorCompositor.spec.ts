import { CompareFieldsValidator } from './CompareFieldsValidator'
import { ValidatorCompositor } from './ValidatorCompositor'

describe('Validator compositor', () => {
  const validator = new ValidatorCompositor([
    new CompareFieldsValidator('field', 'field_to_compare'),
  ])

  it('Should return no errors if receive both equal values', () => {
    const result = validator.validate({
      field: 'value',
      field_to_compare: 'value',
    })

    expect(result.isRight()).toBe(true)
  })

  it('Should return error if receive different values', () => {
    const result = validator.validate({
      field: 'value',
      field_to_compare: 'different_value',
    })

    expect(result.isLeft()).toBe(true)
  })
})
