
export interface Subject {
  id: string;
  name: string;
  hours: number;
}

export interface Instructor {
  id: string;
  name: string;
  availableSubjectIds: string[];
}

export interface TimetableEntry {
  day: string;
  timeSlot: string;
  subjectId: string | null;
  instructorId: string | null;
}

export type TimetableGrid = TimetableEntry[];

export interface AppData {
  subjects: Subject[];
  instructors: Instructor[];
  timetable: TimetableGrid | null;
  settings: {
    workDays: string[];
    timeSlots: string[];
  };
}
