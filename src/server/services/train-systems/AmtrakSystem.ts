import { pbkdf2Sync, createDecipheriv } from 'crypto'
import { TrainSystem } from './TrainSystem.js'
import { TrainEntry } from '../../../shared/types.js'

interface StationInfo {
  code: string
  tz: string
  bus: boolean
  scharr?: string
  schdep?: string
  schcmnt: string
  autoarr: boolean
  autodep: boolean
  estarr?: string
  estdep?: string
  estarrcmnt?: string
  estdepcmnt?: string
  postarr?: string
  postdep?: string
  postcmnt?: string
}

interface Geometry {
  type: string
  coordinates: [number, number]
}

interface Train {
  id: number
  trainNum: string
  routeName: string
  origCode: string
  destCode: string
  heading: string
  velocity: string
  trainState: string
  eventCode: string
  lastValTS: string
  geometry: Geometry
  stations: StationInfo[]
}

export class AmtrakSystem implements TrainSystem {
  name = 'Amtrak'
  
  private readonly TRAIN_URL = 'https://maps.amtrak.com/services/MapDataService/trains/getTrainsData'
  private readonly S_VALUE = Buffer.from('9a3686ac', 'hex')
  private readonly I_VALUE = Buffer.from('c6eb2f7f5c4740c1a2f708fefd947d39', 'hex')
  private readonly PUBLIC_KEY = '69af143c-e8cf-47f8-bf09-fc1f61e5cc33'
  private readonly MASTER_SEGMENT = 88

  private async decrypt(content: string, key: string): Promise<string> {
    const derived = pbkdf2Sync(key, this.S_VALUE, 1000, 16, 'sha1')
    const decipher = createDecipheriv('aes-128-cbc', derived, this.I_VALUE)
    decipher.setAutoPadding(true)
    const data = Buffer.concat([
      decipher.update(Buffer.from(content, 'base64')),
      decipher.final(),
    ])
    return data.toString('utf-8')
  }

  private parseStationInfo(stationStr: string | null): StationInfo | null {
    if (!stationStr) return null
    try {
      return JSON.parse(stationStr)
    } catch {
      return null
    }
  }

  private transformTrainData(rawData: any): Train[] {
    return rawData.features.map((feature: any) => {
      const p = feature.properties
      
      // Extract all station information by finding all Station* properties
      const stations: StationInfo[] = []
      const stationKeys = Object.keys(p).filter(key => key.startsWith('Station') && key.match(/^Station\d+$/))
      
      // Sort station keys numerically to maintain order
      stationKeys.sort((a, b) => {
        const numA = parseInt(a.replace('Station', ''))
        const numB = parseInt(b.replace('Station', ''))
        return numA - numB
      })
      
      for (const stationKey of stationKeys) {
        const stationInfo = this.parseStationInfo(p[stationKey])
        if (stationInfo) {
          stations.push(stationInfo)
        }
      }
      
      return {
        id: feature.id,
        trainNum: p.TrainNum,
        routeName: p.RouteName,
        origCode: p.OrigCode,
        destCode: p.DestCode,
        heading: p.Heading,
        velocity: p.Velocity,
        trainState: p.TrainState,
        eventCode: p.EventCode,
        lastValTS: p.LastValTS,
        geometry: feature.geometry,
        stations
      }
    })
  }

  private async fetchTrains(): Promise<Train[]> {
    const raw = await (await fetch(this.TRAIN_URL)).text()
    const body = raw.slice(0, -this.MASTER_SEGMENT)
    const meta = raw.slice(-this.MASTER_SEGMENT)
    const priv = (await this.decrypt(meta, this.PUBLIC_KEY)).split('|')[0]
    const json = await this.decrypt(body, priv)
    const rawData = JSON.parse(json)
    return this.transformTrainData(rawData)
  }

  async fetchTrainSchedule(stationId: string): Promise<TrainEntry[]> {
    const trains = await this.fetchTrains()
    const trainEntries: TrainEntry[] = []
    
    for (const train of trains) {
      const stationIndex = train.stations.findIndex(s => s.code === stationId)
      if (stationIndex === -1) continue
      
      const station = train.stations[stationIndex]
      const nextStation = train.stations[stationIndex + 1]
      
      // Determine direction based on route
      const direction = train.origCode === stationId ? 'Origin' : 
                       train.destCode === stationId ? 'Terminus' : 
                       'Through'
      
      const entry: TrainEntry = {
        trainId: train.id,
        trainName: train.routeName,
        trainSystem: this.name,
        track: '', // Track info not available in the data
        departureTime: station.schdep || '',
        arrivalTime: station.scharr,
        nextStation: nextStation ? nextStation.code : train.destCode,
        direction: direction,
        actualTime: station.postdep || station.postarr || undefined,
        destination: train.destCode
      }
      
      trainEntries.push(entry)
    }
    
    // Sort by scheduled departure time
    trainEntries.sort((a, b) => {
      const timeA = new Date(a.departureTime || a.arrivalTime || '').getTime()
      const timeB = new Date(b.departureTime || b.arrivalTime || '').getTime()
      return timeA - timeB
    })
    
    return trainEntries
  }
}