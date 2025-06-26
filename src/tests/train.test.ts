import { describe, it, expect } from 'vitest'
import { get_train_schedule } from '../server/routes/train.js'

describe('get_train_schedule', () => {
  it('returns train schedule for any station', () => {
    const result = get_train_schedule('south-station')
    
    expect(result).toHaveLength(3)
    expect(result[0].track).toBe('1')
    expect(result[0].destination).toBe('North Station')
  })

  it('returns same mock data regardless of station', () => {
    const result1 = get_train_schedule('south-station')
    const result2 = get_train_schedule('back-bay')
    
    expect(result1).toEqual(result2)
  })
})