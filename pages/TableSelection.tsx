
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TOTAL_TABLES } from '../constants';

const TableSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleTableSelect = (tableId: number) => {
    navigate(`/table/${tableId}`);
  };

  return (
    <div className="text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-2">Welcome!</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Please select your table number to get started.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {Array.from({ length: TOTAL_TABLES }, (_, i) => i + 1).map((tableId) => (
          <button
            key={tableId}
            onClick={() => handleTableSelect(tableId)}
            className="aspect-square flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <span className="text-sm text-gray-500 dark:text-gray-400">Table</span>
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{tableId}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TableSelection;
