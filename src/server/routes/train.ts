import { Hono } from 'hono'
import { TrainEntry, TrainScheduleResponse } from '../../shared/types.js'

export const trainRoutes = new Hono()

export function get_train_schedule(_station_id: string): TrainEntry[] {
  // Mock data for demonstration
  const mockEntries: TrainEntry[] = [
    {
      track: "1",
      departureTime: "08:15",
      nextStation: "South Station",
      direction: "Inbound",
      actualTime: "08:17",
      destination: "North Station"
    },
    {
      track: "2", 
      departureTime: "08:22",
      nextStation: "Back Bay",
      direction: "Outbound",
      actualTime: "08:22",
      destination: "Worcester"
    },
    {
      track: "3",
      departureTime: "08:30",
      nextStation: "Ruggles",
      direction: "Inbound", 
      actualTime: "08:32",
      destination: "North Station"
    }
  ]

  // Filter or modify based on station_id in real implementation
  return mockEntries
}

trainRoutes.get('/schedule/:stationId', async (c) => {
  const stationId = c.req.param('stationId')
  
  if (!stationId) {
    return c.json({ error: 'Station ID is required' }, 400)
  }

  try {
    const entries = get_train_schedule(stationId)
    const response: TrainScheduleResponse = {
      entries,
      stationId,
      timestamp: new Date().toISOString()
    }
    
    return c.json(response)
  } catch (error) {
    return c.json({ error: 'Failed to fetch train schedule' }, 500)
  }
})