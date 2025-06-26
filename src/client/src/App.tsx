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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <h1 className="text-3xl font-bold text-blue-900 tracking-tight">
              🚄 Train Schedule
            </h1>
            <div className="flex items-center gap-3">
              <label htmlFor="station-select" className="text-sm font-medium text-gray-600">
                Station
              </label>
              <select 
                id="station-select"
                value={stationId} 
                onChange={(e) => setStationId(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-w-64 bg-white"
              >
                {AMTRAK_STATIONS.map(station => (
                  <option key={station.code} value={station.code}>
                    {station.name} ({station.code})
                  </option>
                ))}
              </select>
              <button 
                onClick={fetchSchedule} 
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
              >
                {loading ? '🔄' : '↻'} Refresh
              </button>
            </div>
          </div>
        </header>

        <main>
          {loading ? (
            <div className="text-center py-12">
              <div className="text-2xl mb-2">🔄</div>
              <div className="text-gray-600">Loading schedule...</div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              <div className="text-2xl mb-2">⚠️</div>
              <div>{error}</div>
            </div>
          ) : schedule ? (
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">
                  {AMTRAK_STATIONS.find(s => s.code === schedule.stationId)?.name || schedule.stationId}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {schedule.entries.length} trains • Updated {new Date(schedule.timestamp).toLocaleTimeString()}
                </p>
              </div>
              <div className="divide-y divide-gray-100">
                {schedule.entries.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-3xl mb-2">🚫</div>
                    <div>No trains scheduled</div>
                  </div>
                ) : (
                  schedule.entries.map((entry) => (
                    <div key={entry.trainId} className="p-6 hover:bg-blue-50 transition-colors duration-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="font-semibold text-lg text-gray-900">
                          {entry.trainName}
                        </div>
                        <div className="text-sm text-gray-400 font-mono">
                          #{entry.trainId}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          {entry.arrivalTime && (
                            <div>
                              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                                Arrives
                              </div>
                              <div className="text-lg font-semibold text-gray-900">
                                {new Date(entry.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          )}
                          {entry.departureTime && (
                            <div>
                              <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                                Departs
                              </div>
                              <div className="text-lg font-semibold text-gray-900">
                                {new Date(entry.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {entry.actualTime && entry.actualTime !== entry.departureTime && (
                                  <span className="text-sm text-red-500 ml-2">
                                    (actual: {new Date(entry.actualTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                              Destination
                            </div>
                            <div className="text-gray-900">{entry.destination}</div>
                          </div>
                          <div>
                            <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                              Next Stop
                            </div>
                            <div className="text-gray-900">{entry.nextStation}</div>
                          </div>
                        </div>
                        <div className="space-y-3 text-right">
                          {entry.track && (
                            <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                              Track {entry.track}
                            </div>
                          )}
                          {entry.direction && (
                            <div className="text-xs uppercase tracking-wide text-gray-500">
                              {entry.direction}
                            </div>
                          )}
                          <div className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            {entry.trainSystem}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="text-3xl mb-2">📋</div>
              <div>No schedule data available</div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App