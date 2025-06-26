import { Hono } from 'hono'
import { TrainEntry, TrainScheduleResponse } from '../../shared/types.js'
import { trainSystemManager } from '../services/train-systems/TrainSystemManager.js'

export const trainRoutes = new Hono()

export async function get_train_schedule(station_id: string, systemName?: string): Promise<TrainEntry[]> {
  const system = systemName 
    ? trainSystemManager.getSystem(systemName) 
    : trainSystemManager.getDefaultSystem()
    
  if (!system) {
    throw new Error(`Train system not found: ${systemName}`)
  }
  
  return await system.fetchTrainSchedule(station_id)
}

trainRoutes.get('/schedule/:stationId', async (c) => {
  const stationId = c.req.param('stationId')
  const system = c.req.query('system')
  
  if (!stationId) {
    return c.json({ error: 'Station ID is required' }, 400)
  }

  try {
    const entries = await get_train_schedule(stationId, system)
    const response: TrainScheduleResponse = {
      entries,
      stationId,
      timestamp: new Date().toISOString()
    }
    
    return c.json(response)
  } catch (error) {
    console.error('Error fetching train schedule:', error)
    return c.json({ error: 'Failed to fetch train schedule' }, 500)
  }
})