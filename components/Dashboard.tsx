
import React, { useRef } from 'react';
import type { AppData } from '../types';
import { exportData, importData } from '../services/dataService';
import DownloadIcon from './icons/DownloadIcon';
import UploadIcon from './icons/UploadIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import BookOpenIcon from './icons/BookOpenIcon';

interface DashboardProps {
  data: AppData;
  setData: (data: AppData) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, setData }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportData(data);
    alert('Data backup has been downloaded successfully!');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (window.confirm("Are you sure you want to restore data? This will overwrite all current data.")) {
        try {
          const importedData = await importData(file);
          setData(importedData);
          alert('Data restored successfully!');
        } catch (error) {
          console.error(error);
          alert(`Failed to restore data: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
    }
     // Reset file input to allow re-uploading the same file
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="bg-blue-100 p-4 rounded-full">
            <BookOpenIcon className="h-8 w-8 text-blue-500" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm font-medium">Total Subjects</p>
            <p className="text-3xl font-bold text-gray-800">{data.subjects.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
          <div className="bg-green-100 p-4 rounded-full">
            <UserGroupIcon className="h-8 w-8 text-green-500" />
          </div>
          <div className="ml-4">
            <p className="text-gray-500 text-sm font-medium">Total Instructors</p>
            <p className="text-3xl font-bold text-gray-800">{data.instructors.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Data Management</h3>
        <p className="text-gray-600 mb-6">
          Backup all your application data to a file or restore it from a previous backup. This is useful for moving data between computers or recovering from browser data loss.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={handleExport}
            className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
          >
            <DownloadIcon className="h-5 w-5 mr-2" />
            Backup Data (.json)
          </button>
          
          <button
            onClick={handleImportClick}
            className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
          >
            <UploadIcon className="h-5 w-5 mr-2" />
            Restore Data
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".json"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
