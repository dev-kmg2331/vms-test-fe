import React from 'react';
import styled from 'styled-components';
import { Monitor, Camera, Settings, LayoutDashboard, Moon, Sun } from 'lucide-react';

// styled-components로 스타일링된 컴포넌트
const NavContainer = styled.nav`
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  background-color: ${({ darkMode }) => (darkMode ? '#1f2937' : '#ffffff')};
`;

const NavContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const NavRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LogoText = styled.span`
  font-weight: bold;
  font-size: 1.25rem;
  line-height: 1.75rem;
`;

const MainMenu = styled.div`
  display: none;
  gap: 1rem;
  
  @media (min-width: 768px) {
    display: flex;
  }
`;

const ThemeToggle = styled.button`
  padding: 0.5rem;
  border-radius: 9999px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ darkMode }) => (darkMode ? '#374151' : '#e5e7eb')};
  }
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  
  background-color: ${({ isActive, darkMode }) =>
        isActive
            ? '#dbeafe'
            : 'transparent'
    };
  
  color: ${({ isActive, darkMode }) =>
        isActive
            ? '#1d4ed8'
            : 'inherit'
    };
  
  font-weight: ${({ isActive }) => (isActive ? '500' : '400')};
  
  &:hover {
    background-color: ${({ darkMode, isActive }) =>
        isActive
            ? '#dbeafe'
            : darkMode
                ? '#374151'
                : '#f3f4f6'
    };
    
    color: ${({ isActive, darkMode }) =>
        isActive
            ? '#1d4ed8'
            : '#2563eb'
    };
  }
`;

const IconWrapper = styled.span`
  margin-right: 0.5rem;
`;

const MobileMenu = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 0.5rem 0;
  gap: 1rem;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

export const NavBar = ({ activeTab, setActiveTab, darkMode, toggleDarkMode }) => {
    const navItems = [
        { id: 'dashboard', label: '대시보드', icon: <LayoutDashboard size={20} /> },
        { id: 'vms', label: 'VMS 관리', icon: <Monitor size={20} /> },
        { id: 'cameras', label: '카메라 관리', icon: <Camera size={20} /> },
        { id: 'fieldMapping', label: '필드 매핑', icon: <Settings size={20} /> },
    ];

    return (
        <NavContainer darkMode={darkMode}>
            <NavContent>
                <NavRow>
                    <LogoContainer>
                        <Monitor color="#2563eb" size={24} />
                        <LogoText>VMS 관리 시스템</LogoText>
                    </LogoContainer>

                    <MainMenu>
                        {navItems.map((item) => (
                            <NavButton
                                key={item.id}
                                isActive={activeTab === item.id}
                                darkMode={darkMode}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <IconWrapper>{item.icon}</IconWrapper>
                                {item.label}
                            </NavButton>
                        ))}
                    </MainMenu>

                    <ThemeToggle
                        darkMode={darkMode}
                        onClick={toggleDarkMode}
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </ThemeToggle>
                </NavRow>

                <MobileMenu>
                    {navItems.map((item) => (
                        <NavButton
                            key={item.id}
                            isActive={activeTab === item.id}
                            darkMode={darkMode}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <IconWrapper>{item.icon}</IconWrapper>
                            {item.label}
                        </NavButton>
                    ))}
                </MobileMenu>
            </NavContent>
        </NavContainer>
    );
};