import { TrainEntry } from '../../../shared/types.js'

export interface TrainSystem {
  name: string;
  fetchTrainSchedule(stationId: string): Promise<TrainEntry[]>;
}