import { describe, it, expect } from 'vitest'
import { get_train_schedule } from '../server/routes/train.js'

describe('get_train_schedule', () => {
  it('returns train schedule for NYP with multiple trains', async () => {
    const result = await get_train_schedule('NYP')
    
    expect(result.length).toBeGreaterThan(5)
  })

  it('returns train schedule for WAS with multiple trains', async () => {
    const result = await get_train_schedule('WAS')
    
    expect(result.length).toBeGreaterThan(5)
  })

  it('returns train schedule for smaller stations', async () => {
    const result = await get_train_schedule('SAC')
    
    expect(result.length).toBeGreaterThan(0)
  })
})