import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { NavBar } from './components/NavBar';
import { VmsList } from './pages/VmsList';
import { CamerasList } from './pages/CameraList';
import { FieldMappingConfig } from './pages/FieldMappingConfig';
import { Dashboard } from './pages/DashBoard';
import styled, { createGlobalStyle } from 'styled-components';

// 전역 스타일 정의
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s, color 0.3s;
    background-color: ${({ theme }) => theme.darkMode ? '#111827' : '#f9fafb'};
    color: ${({ theme }) => theme.darkMode ? '#f9fafb' : '#111827'};
  }
  
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace;
  }
  
  * {
    box-sizing: border-box;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
`;

const MainContent = styled.main`
  max-width: 60%;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  // 테마 설정
  const theme = {
    darkMode,
    colors: {
      primary: '#3b82f6',
      secondary: darkMode ? '#374151' : '#f3f4f6',
      background: darkMode ? '#111827' : '#f9fafb',
      card: darkMode ? '#1f2937' : '#ffffff',
      text: darkMode ? '#f9fafb' : '#111827',
      border: darkMode ? '#374151' : '#e5e7eb',
    },
  };

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
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <NavBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <MainContent>{renderContent()}</MainContent>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;