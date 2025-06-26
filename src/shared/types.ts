export interface TrainEntry {
  trainId: number;
  trainName: string;
  trainSystem: string;
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