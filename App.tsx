
import React, { useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import type { AppData } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SubjectManager from './components/SubjectManager';
import InstructorManager from './components/InstructorManager';
import TimetableDisplay from './components/TimetableDisplay';

const initialData: AppData = {
  subjects: [],
  instructors: [],
  timetable: null,
  settings: {
    workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    timeSlots: ["09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00", "13:00 - 14:00", "14:00 - 15:00"],
  }
};

export type View = 'dashboard' | 'subjects' | 'instructors' | 'timetable';

const App: React.FC = () => {
  const [data, setData] = useLocalStorage<AppData>('timetable-app-data', initialData);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard data={data} setData={setData} />;
      case 'subjects':
        return <SubjectManager data={data} setData={setData} />;
      case 'instructors':
        return <InstructorManager data={data} setData={setData} />;
      case 'timetable':
        return <TimetableDisplay data={data} setData={setData} />;
      default:
        return <Dashboard data={data} setData={setData} />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
