
import React from 'react';
import TableCellsIcon from './icons/TableCellsIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center">
        <TableCellsIcon className="h-8 w-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-900 ml-3">
          Standalone Timetable Generator
        </h1>
      </div>
    </header>
  );
};

export default Header;
