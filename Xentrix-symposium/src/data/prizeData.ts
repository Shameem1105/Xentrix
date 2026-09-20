import { ALL_EVENTS } from './eventsData';

export const TOTAL_PRIZE_POOL = 59500;

export const PRIZE_SUMMARY = {
  totalPoolFormatted: '₹59,500',
  technicalEventsCount: 11,
  nonTechnicalEventsCount: 15,
  totalEvents: 26,
  topPrize: '₹5,000 (Robo Race First Prize)'
};

export function getEventPrizes() {
  return ALL_EVENTS.map(event => ({
    id: event.id,
    name: event.name,
    category: event.category,
    totalPrize: event.prizePool,
    first: event.prizes.first,
    second: event.prizes.second,
    third: event.prizes.third
  }));
}
