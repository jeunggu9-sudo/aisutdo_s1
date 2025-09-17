
import React, { useState, useMemo } from 'react';
import type { Instructor, AppData } from '../types';

interface InstructorManagerProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const InstructorManager: React.FC<InstructorManagerProps> = ({ data, setData }) => {
  const [name, setName] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

  const subjectMap = useMemo(() => {
    return new Map(data.subjects.map(s => [s.id, s.name]));
  }, [data.subjects]);

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subjectId)) {
        newSet.delete(subjectId);
      } else {
        newSet.add(subjectId);
      }
      return newSet;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    if (editingInstructor) {
        setData(prevData => ({
            ...prevData,
            instructors: prevData.instructors.map(i => i.id === editingInstructor.id ? { ...i, name, availableSubjectIds: Array.from(selectedSubjects) } : i)
        }));
    } else {
        const newInstructor: Instructor = {
            id: new Date().toISOString(),
            name,
            availableSubjectIds: Array.from(selectedSubjects),
        };
        setData(prevData => ({...prevData, instructors: [...prevData.instructors, newInstructor]}));
    }
    
    setName('');
    setSelectedSubjects(new Set());
    setEditingInstructor(null);
  };
  
  const handleEdit = (instructor: Instructor) => {
    setEditingInstructor(instructor);
    setName(instructor.name);
    setSelectedSubjects(new Set(instructor.availableSubjectIds));
  };
  
  const handleDelete = (instructorId: string) => {
    if (window.confirm("Are you sure you want to delete this instructor?")) {
        setData(prevData => ({
            ...prevData,
            instructors: prevData.instructors.filter(i => i.id !== instructorId)
        }));
    }
  };

  const cancelEdit = () => {
    setEditingInstructor(null);
    setName('');
    setSelectedSubjects(new Set());
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Instructors</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">{editingInstructor ? 'Edit Instructor' : 'Add New Instructor'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="instructorName" className="block text-sm font-medium text-gray-700">Instructor Name</label>
                <input
                  type="text"
                  id="instructorName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., Dr. Smith"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teachable Subjects</label>
                <div className="mt-2 border border-gray-300 rounded-md max-h-60 overflow-y-auto p-2 space-y-2">
                  {data.subjects.length > 0 ? data.subjects.map(subject => (
                    <div key={subject.id} className="flex items-center">
                      <input
                        id={`subject-${subject.id}`}
                        type="checkbox"
                        checked={selectedSubjects.has(subject.id)}
                        onChange={() => handleSubjectToggle(subject.id)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor={`subject-${subject.id}`} className="ml-3 text-sm text-gray-700">{subject.name}</label>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500">Please add subjects first.</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                 {editingInstructor && (
                    <button type="button" onClick={cancelEdit} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Cancel</button>
                 )}
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{editingInstructor ? 'Update Instructor' : 'Add Instructor'}</button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
           <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b">
                    <h3 className="text-xl font-semibold">Instructor List</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teachable Subjects</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.instructors.length > 0 ? data.instructors.map((instructor) => (
                        <tr key={instructor.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{instructor.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {instructor.availableSubjectIds.map(id => subjectMap.get(id)).join(', ') || 'None'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button onClick={() => handleEdit(instructor)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                <button onClick={() => handleDelete(instructor.id)} className="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                        </tr>
                        )) : (
                        <tr>
                            <td colSpan={3} className="text-center py-10 text-gray-500">No instructors added yet.</td>
                        </tr>
                        )}
                    </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorManager;
