import React, { useState, useMemo } from 'react';
import type { AppData } from '../types';
import { generateTimetable } from '../services/timetableGenerator';
// FIX: Import the TableCellsIcon component to resolve the 'Cannot find name' error.
import TableCellsIcon from './icons/TableCellsIcon';

interface TimetableDisplayProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const TimetableDisplay: React.FC<TimetableDisplayProps> = ({ data, setData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { subjects, instructors, settings, timetable } = data;

  const dataMap = useMemo(() => {
    const subjectMap = new Map(subjects.map(s => [s.id, s.name]));
    const instructorMap = new Map(instructors.map(i => [i.id, i.name]));
    return { subjectMap, instructorMap };
  }, [subjects, instructors]);

  const handleGenerate = async () => {
    if(subjects.length === 0 || instructors.length === 0) {
        alert("Please add at least one subject and one instructor before generating a timetable.");
        return;
    }
    setIsLoading(true);
    const newTimetable = await generateTimetable(data);
    setData(prevData => ({ ...prevData, timetable: newTimetable }));
    setIsLoading(false);
  };

  const handleExport = (format: 'PDF' | 'Excel') => {
      alert(`Export to ${format} functionality coming soon!`);
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Timetable</h2>
        <div className="flex space-x-2">
            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? 'Generating...' : 'Generate Timetable'}
            </button>
             <button onClick={() => handleExport('PDF')} className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 disabled:bg-gray-300" disabled={!timetable}>Export PDF</button>
             <button onClick={() => handleExport('Excel')} className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-300" disabled={!timetable}>Export Excel</button>
        </div>
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <svg className="animate-spin h-10 w-10 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-lg font-medium text-gray-700">Generating optimal timetable...</p>
                <p className="text-sm text-gray-500">This may take a moment.</p>
            </div>
        </div>
      )}

      {!isLoading && timetable && (
         <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 font-semibold text-left text-sm text-gray-600 border border-gray-200">Time</th>
                            {settings.workDays.map(day => (
                                <th key={day} className="p-3 font-semibold text-left text-sm text-gray-600 border border-gray-200">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {settings.timeSlots.map(slot => (
                            <tr key={slot} className="even:bg-gray-50">
                                <td className="p-3 text-sm font-medium text-gray-800 border border-gray-200">{slot}</td>
                                {settings.workDays.map(day => {
                                    const entry = timetable.find(e => e.day === day && e.timeSlot === slot);
                                    return (
                                        <td key={`${day}-${slot}`} className="p-3 border border-gray-200 align-top">
                                            {entry && entry.subjectId ? (
                                                <div>
                                                    <p className="font-bold text-indigo-700">{dataMap.subjectMap.get(entry.subjectId)}</p>
                                                    <p className="text-xs text-gray-600 mt-1">{dataMap.instructorMap.get(entry.instructorId!)}</p>
                                                </div>
                                            ) : <div className="text-gray-400 text-xs">Unassigned</div>}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {!isLoading && !timetable && (
        <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <TableCellsIcon className="h-12 w-12 text-gray-400 mx-auto"/>
                <p className="mt-4 text-lg font-medium text-gray-700">No timetable generated.</p>
                <p className="text-sm text-gray-500">Click "Generate Timetable" to begin.</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default TimetableDisplay;