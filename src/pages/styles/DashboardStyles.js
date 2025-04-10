import styled from 'styled-components';

export const DashboardContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

export const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const Title = styled.h1`
    font-size: 1.5rem;
    font-weight: 700;
    color: ${({theme}) => theme.colors.text};
`;

export const GridContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    @media (min-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
    }
`;

export const StatItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
`;

export const StatInfo = styled.div`
    display: flex;
    align-items: center;
`;

export const StatIconWrapper = styled.div`
    margin-right: 0.5rem;
    color: ${({color}) => color || '#3b82f6'};
`;

export const StatContent = styled.div``;

export const StatLabel = styled.h4`
    font-weight: 500;
    margin: 0;
    color: ${({theme}) => theme.colors.text};
`;

export const StatValue = styled.p`
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    color: ${({theme}) => theme.colors.text};
`;

export const StatSubtext = styled.p`
    font-size: 0.875rem;
    color: ${({theme}) => theme.darkMode ? '#9ca3af' : '#6b7280'};
    margin: 0;
`;

export const StatList = styled.ul`
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const StatListItem = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-radius: 0.375rem;

    &:hover {
        background-color: ${({theme}) => theme.darkMode ? '#374151' : '#f3f4f6'};
    }
`;

export const StatTypeLabel = styled.span`
    color: ${({theme}) => theme.darkMode ? '#9ca3af' : '#6b7280'};
`;

export const StatCount = styled.span`
    font-weight: 500;
    color: ${({theme}) => theme.colors.text};
`;

export const SystemStatusItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
`;

export const StatusLabel = styled.span`
    color: ${({theme}) => theme.darkMode ? '#9ca3af' : '#6b7280'};
`;

export const StatusValue = styled.span`
    font-weight: 500;
    color: ${({color, theme}) => color || theme.colors.text};
`;
