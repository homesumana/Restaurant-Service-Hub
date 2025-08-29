
import React from 'react';
import { HashRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { QueueProvider } from './context/QueueContext';
import TableSelection from './pages/TableSelection';
import TableView from './pages/TableView';
import StaffDashboard from './pages/StaffDashboard';
import Header from './components/Header';

const TableViewWrapper: React.FC = () => {
    const { tableId } = useParams<{ tableId: string }>();
    const tableNumber = parseInt(tableId || '0', 10);

    if (isNaN(tableNumber) || tableNumber <= 0) {
        return <Navigate to="/" replace />;
    }

    return <TableView tableId={tableNumber} />;
};


const App: React.FC = () => {
  return (
    <QueueProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col font-sans text-gray-800 dark:text-gray-200">
          <Header />
          <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<TableSelection />} />
              <Route path="/table/:tableId" element={<TableViewWrapper />} />
              <Route path="/staff" element={<StaffDashboard />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </QueueProvider>
  );
};

export default App;
