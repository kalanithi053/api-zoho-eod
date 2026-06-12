import { TrackModuleBodyDto } from "../dto/track.dto";
import {
  WORK_START,
  splitIntoSegments,
  formatTime,
  skipBreaks,
} from "./time.utils";

const BASE_LOG_PAYLOAD = {
  frompage: "taskdetails",
  notes: "<div>Worked on API integration</div>",
  bill_status: "Billable",
  for_timer: false,
};

export const buildLogPayload = (
  rest: Record<string, any>,
  start_time: string,
  end_time: string,
) => ({ ...rest, ...BASE_LOG_PAYLOAD, start_time, end_time });

function timeToMinutes(time: string): number {
  const [timePart, period] = time.trim().split(" ");
  const [h, m] = timePart.split(":").map(Number);
  const hours =
    period?.toUpperCase() === "PM" && h !== 12
      ? h + 12
      : period?.toUpperCase() === "AM" && h === 12
        ? 0
        : h;
  return hours * 60 + m;
}

function minutesToTime(minutes: number): string {
  const totalHours = Math.floor(minutes / 60);
  const h = totalHours % 12 || 12;
  const m = String(minutes % 60).padStart(2, "0");
  const period = totalHours < 12 ? "AM" : "PM";
  return `${String(h).padStart(2, "0")}:${m} ${period}`;
}

export const buildLogPayloads = (
  body: TrackModuleBodyDto[],
): Record<string, any>[] => {
  const payloads: Record<string, any>[] = [];
  let cursor = WORK_START;

  for (const { start_time = "", end_time = "", duration, ...rest } of body) {
    const isDurationOnly =
      !start_time && !end_time && Number.isSafeInteger(duration);

    if (isDurationOnly) {
      const segments = splitIntoSegments(cursor, Math.round(duration * 60));

      for (const { start, end } of segments) {
        payloads.push(
          buildLogPayload(rest, formatTime(start), formatTime(end)),
        );
      }

      cursor = skipBreaks(segments[segments.length - 1].end);
    } else {
      const startMinutes = timeToMinutes(start_time);
      const endMinutes = timeToMinutes(end_time);
      payloads.push(
        buildLogPayload(
          rest,
          minutesToTime(startMinutes),
          minutesToTime(endMinutes),
        ),
      );
    }
  }
  return payloads;
};
