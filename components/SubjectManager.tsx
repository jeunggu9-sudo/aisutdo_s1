
import React, { useState } from 'react';
import type { Subject, AppData } from '../types';

interface SubjectManagerProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const SubjectManager: React.FC<SubjectManagerProps> = ({ data, setData }) => {
  const [name, setName] = useState('');
  const [hours, setHours] = useState('');
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !hours) return;

    if (editingSubject) {
        // Edit existing subject
        setData(prevData => ({
            ...prevData,
            subjects: prevData.subjects.map(s => s.id === editingSubject.id ? { ...s, name, hours: parseInt(hours) } : s)
        }));
    } else {
        // Add new subject
        const newSubject: Subject = {
            id: new Date().toISOString(),
            name,
            hours: parseInt(hours),
        };
        setData(prevData => ({...prevData, subjects: [...prevData.subjects, newSubject]}));
    }
    
    setName('');
    setHours('');
    setEditingSubject(null);
  };

  const handleEdit = (subject: Subject) => {
    setEditingSubject(subject);
    setName(subject.name);
    setHours(subject.hours.toString());
  };
  
  const handleDelete = (subjectId: string) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
        setData(prevData => ({
            ...prevData,
            subjects: prevData.subjects.filter(s => s.id !== subjectId)
        }));
    }
  };

  const cancelEdit = () => {
    setEditingSubject(null);
    setName('');
    setHours('');
  };


  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Manage Subjects</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="subjectName" className="block text-sm font-medium text-gray-700">Subject Name</label>
                <input
                  type="text"
                  id="subjectName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., Advanced Mathematics"
                  required
                />
              </div>
              <div>
                <label htmlFor="subjectHours" className="block text-sm font-medium text-gray-700">Total Hours</label>
                <input
                  type="number"
                  id="subjectHours"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., 40"
                  required
                  min="1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                 {editingSubject && (
                    <button type="button" onClick={cancelEdit} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Cancel</button>
                 )}
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">{editingSubject ? 'Update Subject' : 'Add Subject'}</button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
           <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-semibold">Subject List</h3>
                    <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700" onClick={() => alert('Excel import functionality coming soon!')}>
                        Import from Excel
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                        <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.subjects.length > 0 ? data.subjects.map((subject) => (
                        <tr key={subject.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.hours}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                            <button onClick={() => handleEdit(subject)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                            <button onClick={() => handleDelete(subject.id)} className="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                        </tr>
                        )) : (
                        <tr>
                            <td colSpan={3} className="text-center py-10 text-gray-500">No subjects added yet.</td>
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

export default SubjectManager;
