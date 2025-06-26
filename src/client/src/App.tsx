import { useState, useEffect } from 'react'
import { TrainScheduleResponse } from '../../shared/types'

const AMTRAK_STATIONS = [
  { code: 'NYP', name: 'New York Penn Station' },
  { code: 'WAS', name: 'Washington Union Station' },
  { code: 'BOS', name: 'Boston South Station' },
  { code: 'PHL', name: 'Philadelphia 30th Street' },
  { code: 'CHI', name: 'Chicago Union Station' },
  { code: 'LAX', name: 'Los Angeles Union Station' },
  { code: 'SEA', name: 'Seattle King Street Station' },
  { code: 'SAC', name: 'Sacramento Valley Station' },
  { code: 'PDX', name: 'Portland Union Station' },
  { code: 'BWI', name: 'BWI Airport' },
  { code: 'NWK', name: 'Newark Penn Station' },
  { code: 'BAL', name: 'Baltimore Penn Station' }
]

function App() {
  const [schedule, setSchedule] = useState<TrainScheduleResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [stationId, setStationId] = useState('NYP')
  const [error, setError] = useState<string | null>(null)

  const fetchSchedule = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/train/schedule/${stationId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch schedule')
      }
      const data = await response.json()
      setSchedule(data)
    } catch (error) {
      console.error('Failed to fetch schedule:', error)
      setError('Failed to load train schedule. Please try again.')
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
        <h1>Amtrak Train Schedule</h1>
        <div className="station-selector">
          <label htmlFor="station-select">Station: </label>
          <select 
            id="station-select"
            value={stationId} 
            onChange={(e) => setStationId(e.target.value)}
          >
            {AMTRAK_STATIONS.map(station => (
              <option key={station.code} value={station.code}>
                {station.name} ({station.code})
              </option>
            ))}
          </select>
          <button onClick={fetchSchedule} disabled={loading}>
            Refresh
          </button>
        </div>
      </header>

      <main>
        {loading ? (
          <div className="loading">Loading schedule...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : schedule ? (
          <div className="schedule">
            <h2>
              Schedule for {AMTRAK_STATIONS.find(s => s.code === schedule.stationId)?.name || schedule.stationId}
            </h2>
            <p className="schedule-info">
              {schedule.entries.length} trains • Updated: {new Date(schedule.timestamp).toLocaleTimeString()}
            </p>
            <div className="entries">
              {schedule.entries.length === 0 ? (
                <div className="no-trains">No trains scheduled for this station</div>
              ) : (
                schedule.entries.map((entry) => (
                  <div key={entry.trainId} className="entry">
                    <div className="train-header">
                      <div className="train-name">{entry.trainName}</div>
                      <div className="train-id">#{entry.trainId}</div>
                    </div>
                    <div className="train-details">
                      <div className="times">
                        {entry.arrivalTime && (
                          <div className="arrival">
                            <span className="label">Arrives:</span>
                            <span className="time">{new Date(entry.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        )}
                        {entry.departureTime && (
                          <div className="departure">
                            <span className="label">Departs:</span>
                            <span className="time">{new Date(entry.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {entry.actualTime && entry.actualTime !== entry.departureTime && (
                              <span className="actual"> (actual: {new Date(entry.actualTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="route-info">
                        <div className="destination">
                          <span className="label">To:</span> {entry.destination}
                        </div>
                        <div className="next-station">
                          <span className="label">Next:</span> {entry.nextStation}
                        </div>
                      </div>
                      <div className="status-info">
                        {entry.track && <div className="track">Track {entry.track}</div>}
                        {entry.direction && <div className="direction">{entry.direction}</div>}
                        <div className="system">{entry.trainSystem}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="no-data">No schedule data available</div>
        )}
      </main>
    </div>
  )
}

export default App