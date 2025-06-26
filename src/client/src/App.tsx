import { useState, useEffect } from 'react'
import { TrainScheduleResponse } from '../../shared/types'

function App() {
  const [schedule, setSchedule] = useState<TrainScheduleResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [stationId, setStationId] = useState('south-station')

  const fetchSchedule = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/train/schedule/${stationId}`)
      const data = await response.json()
      setSchedule(data)
    } catch (error) {
      console.error('Failed to fetch schedule:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedule()
  }, [stationId])

  return (
    <div className="app">
      <header>
        <h1>BackBay Train Schedule</h1>
        <div>
          <label htmlFor="station-select">Station: </label>
          <select 
            id="station-select"
            value={stationId} 
            onChange={(e) => setStationId(e.target.value)}
          >
            <option value="south-station">South Station</option>
            <option value="back-bay">Back Bay</option>
            <option value="north-station">North Station</option>
          </select>
        </div>
      </header>

      <main>
        {loading ? (
          <div>Loading schedule...</div>
        ) : schedule ? (
          <div className="schedule">
            <h2>Schedule for {schedule.stationId}</h2>
            <div className="entries">
              {schedule.entries.map((entry, index) => (
                <div key={index} className="entry">
                  <div className="track">Track {entry.track}</div>
                  <div className="time">
                    <span className="scheduled">{entry.departureTime}</span>
                    {entry.actualTime && entry.actualTime !== entry.departureTime && (
                      <span className="actual">({entry.actualTime})</span>
                    )}
                  </div>
                  <div className="destination">{entry.destination}</div>
                  <div className="next-station">Next: {entry.nextStation}</div>
                  {entry.direction && <div className="direction">{entry.direction}</div>}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>No schedule data available</div>
        )}
      </main>
    </div>
  )
}

export default App