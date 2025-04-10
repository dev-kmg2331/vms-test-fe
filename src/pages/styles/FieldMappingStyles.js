import styled from 'styled-components';

export const PageContainer = styled.div`
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

export const ToolbarContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: ${({theme}) => theme.darkMode ? '#1f2937' : '#f9fafb'};
    border: 1px solid ${({theme}) => theme.darkMode ? '#374151' : '#e5e7eb'};
`;

export const ToolbarLeft = styled.div`
    flex-grow: 1;
    margin-right: 1rem;
`;

export const ToolbarRight = styled.div`
    display: flex;
    gap: 0.5rem;
`;

export const SectionTitle = styled.h3`
    font-size: 1.125rem;
    font-weight: 500;
    margin: 0 0 0.5rem 0;
    color: ${({theme}) => theme.colors.text};
`;

export const SectionSubtitle = styled.p`
    font-size: 0.875rem;
    color: ${({theme}) => theme.darkMode ? '#9ca3af' : '#6b7280'};
    margin: 0.25rem 0 1rem 0;
`;

export const TableContainer = styled.div`
    overflow-x: auto;
`;

export const Table = styled.table`
    min-width: 100%;
    border-collapse: separate;
    border-spacing: 0;
`;

export const TableHead = styled.thead`
    background-color: ${({theme}) => theme.darkMode ? '#374151' : '#f9fafb'};
`;

export const TableHeadCell = styled.th`
    padding: 0.75rem 1.5rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: ${({theme}) => theme.darkMode ? '#9ca3af' : '#6b7280'};
    border-bottom: 1px solid ${({theme}) => theme.darkMode ? '#4b5563' : '#e5e7eb'};
`;

export const TableBody = styled.tbody`
    background-color: ${({theme}) => theme.colors.card};

    & > tr {
        border-bottom: 1px solid ${({theme}) => theme.darkMode ? '#4b5563' : '#e5e7eb'};

        &:hover {
            background-color: ${({theme}) => theme.darkMode ? '#374151' : '#f3f4f6'};
        }
    }
`;

export const TableCell = styled.td`
    padding: 1rem 1.5rem;
    vertical-align: middle;
    color: ${({theme}) => theme.colors.text};
`;

export const EmptyMessage = styled.p`
    text-align: center;
    padding: 2rem;
    color: ${({theme}) => theme.darkMode ? '#9ca3af' : '#6b7280'};
`;

export const TypeBadge = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 9999px;
    background-color: ${({theme}) => theme.darkMode ? 'rgba(59, 130, 246, 0.1)' : '#dbeafe'};
    color: ${({theme}) => theme.darkMode ? '#60a5fa' : '#1d4ed8'};
`;

export const ButtonGroup = styled.div`
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
`;

export const CodePreview = styled.pre`
    background-color: ${({theme}) => theme.darkMode ? '#111827' : '#f3f4f6'};
    padding: 1rem;
    border-radius: 0.5rem;
    font-size: 0.75rem;
    overflow: auto;
    max-height: 24rem;
    color: ${({theme}) => theme.colors.text};
`;

export const ParameterList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
`;

export const ParameterItem = styled.div`
    font-size: 0.875rem;
`;

export const ParameterLabel = styled.span`
    font-weight: 500;
    margin-right: 0.25rem;
`;
