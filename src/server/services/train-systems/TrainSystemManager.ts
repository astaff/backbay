import { TrainSystem } from './TrainSystem.js'
import { AmtrakSystem } from './AmtrakSystem.js'

export class TrainSystemManager {
  private systems: Map<string, TrainSystem> = new Map()

  constructor() {
    // Register available train systems
    this.registerSystem(new AmtrakSystem())
  }

  registerSystem(system: TrainSystem): void {
    this.systems.set(system.name.toLowerCase(), system)
  }

  getSystem(name: string): TrainSystem | undefined {
    return this.systems.get(name.toLowerCase())
  }

  getDefaultSystem(): TrainSystem {
    // Default to Amtrak for now
    return this.systems.get('amtrak')!
  }

  getAllSystems(): TrainSystem[] {
    return Array.from(this.systems.values())
  }
}

// Export singleton instance
export const trainSystemManager = new TrainSystemManager()