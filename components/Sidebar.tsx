
import React from 'react';
import type { View } from '../App';
import HomeIcon from './icons/HomeIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import TableCellsIcon from './icons/TableCellsIcon';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'subjects', label: 'Subjects', icon: BookOpenIcon },
    { id: 'instructors', label: 'Instructors', icon: UserGroupIcon },
    { id: 'timetable', label: 'Timetable', icon: TableCellsIcon },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg flex-shrink-0">
      <div className="p-4">
        <nav className="mt-5">
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id as View)}
                  className={`w-full flex items-center px-4 py-3 my-1 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    currentView === item.id
                      ? 'bg-indigo-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
