import { SymposiumEvent, EventConflict } from '../types';

/**
 * Converts a time string (HH:MM or HH:MM:SS in 24hr format) into total minutes from midnight.
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  return hours * 60 + minutes;
}

/**
 * Checks if two events have overlapping time windows.
 * Two intervals [startA, endA) and [startB, endB) overlap if startA < endB AND startB < endA.
 */
export function doEventsOverlap(eventA: SymposiumEvent, eventB: SymposiumEvent): boolean {
  if (eventA.id === eventB.id) return false;

  const startA = timeToMinutes(eventA.startTime);
  const endA = timeToMinutes(eventA.endTime);
  const startB = timeToMinutes(eventB.startTime);
  const endB = timeToMinutes(eventB.endTime);

  return startA < endB && startB < endA;
}

/**
 * Validates a list of selected events and returns all conflicts found.
 */
export function getEventConflicts(selectedEvents: SymposiumEvent[]): EventConflict[] {
  const conflicts: EventConflict[] = [];

  for (let i = 0; i < selectedEvents.length; i++) {
    for (let j = i + 1; j < selectedEvents.length; j++) {
      const e1 = selectedEvents[i];
      const e2 = selectedEvents[j];
      if (doEventsOverlap(e1, e2)) {
        conflicts.push({
          event1: e1,
          event2: e2,
          reason: `"${e1.name}" (${e1.displayTime}) overlaps with "${e2.name}" (${e2.displayTime}).`
        });
      }
    }
  }

  return conflicts;
}

/**
 * Checks whether adding `targetEvent` to `currentlySelected` causes a time conflict.
 */
export function checkCanSelectEvent(
  currentlySelected: SymposiumEvent[],
  targetEvent: SymposiumEvent
): { canSelect: boolean; conflictingEvent?: SymposiumEvent; message?: string } {
  // If already selected, we can unselect
  const isAlreadySelected = currentlySelected.some(e => e.id === targetEvent.id);
  if (isAlreadySelected) {
    return { canSelect: true };
  }

  for (const existing of currentlySelected) {
    if (doEventsOverlap(existing, targetEvent)) {
      return {
        canSelect: false,
        conflictingEvent: existing,
        message: `"${targetEvent.name}" (${targetEvent.displayTime}) conflicts with "${existing.name}" (${existing.displayTime}). Please remove one event to proceed.`
      };
    }
  }

  return { canSelect: true };
}
