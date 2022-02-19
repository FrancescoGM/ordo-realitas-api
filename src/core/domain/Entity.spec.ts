import { Entity } from './Entity'

class CustomEntity<T = {}> extends Entity<T> {}

describe('Core Entity', () => {
  it('Should generate an ID if not provided', () => {
    const entity = new CustomEntity({})

    expect(entity.id).toBeDefined()
  })

  it('Should use the provided ID if provided', () => {
    const entity = new CustomEntity({}, 'custom-id')

    expect(entity.id).toBe('custom-id')
  })

  it('Should have props when props is provided', () => {
    const entity = new CustomEntity<{ foo: string }>({ foo: 'bar' })

    expect(entity.props).toEqual({ foo: 'bar' })
  })
})
