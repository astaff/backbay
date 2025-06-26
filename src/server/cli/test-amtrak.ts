#!/usr/bin/env node
import { AmtrakSystem } from '../services/train-systems/AmtrakSystem.js'

async function main() {
  const stationCode = process.argv[2] || 'NYP'
  const amtrak = new AmtrakSystem()
  
  console.log(`Fetching train schedule for ${stationCode}...`)
  
  try {
    const trains = await amtrak.fetchTrainSchedule(stationCode)
    console.log(`\nFound ${trains.length} trains:\n`)
    
    trains.slice(0, 10).forEach(train => {
      console.log(`${train.trainName} (${train.trainId})`)
      console.log(`  Departure: ${train.departureTime || 'N/A'}`)
      console.log(`  Arrival: ${train.arrivalTime || 'N/A'}`)
      console.log(`  Next: ${train.nextStation} → ${train.destination}`)
      console.log(`  Track: ${train.track || 'TBD'}`)
      console.log()
    })
    
    if (trains.length > 10) {
      console.log(`... and ${trains.length - 10} more trains`)
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

main()