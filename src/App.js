import React, { useState } from 'react';
import { NavBar } from './components/NavBar';
import { VmsList } from './pages/VmsList';
import { CamerasList } from './pages/CameraList';
import { FieldMappingConfig } from './pages/FieldMappingConfig';
import { Dashboard } from './pages/DashBoard';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'vms':
        return <VmsList />;
      case 'cameras':
        return <CamerasList />;
      case 'fieldMapping':
        return <FieldMappingConfig />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <NavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;