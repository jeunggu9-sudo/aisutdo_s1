
import type { AppData, TimetableGrid } from '../types';

export const generateTimetable = (data: AppData): Promise<TimetableGrid> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { subjects, instructors, settings } = data;
      const { workDays, timeSlots } = settings;

      const newTimetable: TimetableGrid = [];

      if (subjects.length === 0 || instructors.length === 0) {
        resolve([]);
        return;
      }

      let subjectIndex = 0;
      let instructorIndex = 0;

      for (const day of workDays) {
        for (const timeSlot of timeSlots) {
          const subject = subjects[subjectIndex % subjects.length];
          const instructor = instructors[instructorIndex % instructors.length];

          const canTeach = instructor.availableSubjectIds.includes(subject.id);
          
          if(canTeach) {
             newTimetable.push({
                day,
                timeSlot,
                subjectId: subject.id,
                instructorId: instructor.id,
             });
             subjectIndex++;
          } else {
             newTimetable.push({
                day,
                timeSlot,
                subjectId: null,
                instructorId: null,
             });
          }
          instructorIndex++;
        }
      }

      resolve(newTimetable);
    }, 2000); // Simulate a 2-second generation process
  });
};
