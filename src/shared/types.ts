export interface TrainEntry {
  track: string;
  departureTime: string;
  arrivalTime?: string;
  nextStation: string;
  direction?: string;
  actualTime?: string;
  destination: string;
}

export interface TrainScheduleResponse {
  entries: TrainEntry[];
  stationId: string;
  timestamp: string;
}