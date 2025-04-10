import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const FilterRow = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (min-width: 768px) {
        flex-direction: row;
        align-items: flex-end;
    }
`;

export const SelectWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 0;

    @media (min-width: 768px) {
        width: 16rem;
    }
`;

export const SearchWrapper = styled.div`
    position: relative;
    flex-grow: 1;

    svg {
        position: absolute;
        top: 50%;
        left: 0.75rem;
        transform: translateY(-50%);
        color: #9ca3af;
        pointer-events: none;
    }

    input {
        width: 100%;
        padding: 0.5rem 0.75rem 0.5rem 2.5rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        transition: 0.15s;

        &:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 1px #3b82f6;
        }
    }
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

export const Thead = styled.thead`
    background-color: #f9fafb;

    th {
        padding: 0.75rem 1.5rem;
        text-align: left;
        font-size: 0.75rem;
        font-weight: 500;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
`;

export const Tbody = styled.tbody`
    background-color: white;

    td {
        padding: 1rem 1.5rem;
        vertical-align: middle;
        white-space: nowrap;
    }

    tr:hover {
        background-color: #f9fafb;
    }
`;

export const StatusBadge = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 0.125rem 0.625rem;
    font-size: 0.75rem;
    font-weight: 500;
    border-radius: 9999px;

    background-color: ${({enabled}) =>
            enabled ? '#d1fae5' : '#fee2e2'};
    color: ${({enabled}) =>
            enabled ? '#065f46' : '#991b1b'};
`;

export const FeatureBadge = styled.span`
    display: inline-flex;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 9999px;
    background-color: ${({type, active}) =>
            !active ? '#e5e7eb' :  // 비활성화 상태일 때 회색
                    type === 'ptz' ? '#dbeafe' : '#ede9fe'
    };
    color: ${({type, active}) =>
            !active ? '#374151' :
            type === 'ptz' ? '#1e40af' : '#6b21a8'};
`;

export const VmsBadge = styled.span`
    display: inline-flex;
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 9999px;
    background-color: #f3f4f6;
    color: #374151;
`;

export const NoDataRow = styled.tr`
    td {
        text-align: center;
        color: #6b7280;
    }
`;
