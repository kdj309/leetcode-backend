import { beforeEach, describe } from 'node:test';
import { LeaderboardEventsService } from './leaderboard_events.service';

describe('LeaderboardEventsService', () => {
  let service: LeaderboardEventsService;

  beforeEach(() => {
    service = new LeaderboardEventsService();
  });

  it('should broadcast leaderboard updates to subscribed clients', () => {
    const receivedEvents: any[] = [];

    const subscription = service.subscribe().subscribe((event) => {
      receivedEvents.push(event);
    });

    service.broadcastLeaderboardUpdate({
      type: 'leaderboard:updated',
      data: { usersCount: 3 },
    });

    expect(receivedEvents).toHaveLength(1);
    expect(receivedEvents[0].type).toBe('leaderboard:updated');
    expect(receivedEvents[0].data).toEqual({ usersCount: 3 });

    subscription.unsubscribe();
  });
});
