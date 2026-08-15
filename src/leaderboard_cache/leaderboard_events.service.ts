import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';

export interface LeaderboardEventPayload {
  type: string;
  data: any;
  timestamp?: string;
}

@Injectable()
export class LeaderboardEventsService {
  private readonly clients = new Subject<LeaderboardEventPayload>();

  subscribe(): Observable<LeaderboardEventPayload> {
    return this.clients.asObservable();
  }

  broadcastLeaderboardUpdate(payload: any) {
    const eventPayload: LeaderboardEventPayload = {
      type: payload?.type || 'leaderboard:updated',
      data: payload?.data ?? payload,
      timestamp: new Date().toISOString(),
    };

    this.clients.next(eventPayload);
    return eventPayload;
  }
}
