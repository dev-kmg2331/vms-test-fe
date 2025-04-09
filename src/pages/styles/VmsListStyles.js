import styled from 'styled-components';

// 페이지 컨테이너
export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

// 헤더 컨테이너
export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// 타이틀
export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

// 툴바 컨테이너
export const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

// 테이블 컨테이너
export const TableContainer = styled.div`
  overflow-x: auto;
`;

// 테이블
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

// 테이블 헤더
export const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.darkMode ? '#374151' : '#f9fafb'};
`;

// 테이블 행
export const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.darkMode ? '#374151' : '#e5e7eb'};
  
  &:hover {
    background-color: ${({ theme }) => theme.darkMode ? '#374151' : '#f3f4f6'};
  }
`;

// 테이블 헤더 셀
export const TableHeader = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  color: ${({ theme }) => theme.darkMode ? '#9ca3af' : '#6b7280'};
`;

// 테이블 데이터 셀
export const TableCell = styled.td`
  padding: 1rem;
  vertical-align: middle;
  color: ${({ theme }) => theme.colors.text};
`;

// 상태 배지
export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${({ $active }) => $active ? `
    background-color: rgba(34, 197, 94, 0.1);
    color: #166534;
  ` : `
    background-color: rgba(239, 68, 68, 0.1);
    color: #991b1b;
  `}
`;

// VMS 타입 배지
export const TypeBadge = styled.span`
  display: inline-flex;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: #dbeafe;
  color: #1d4ed8;
`;

// 액션 버튼 그룹
export const ActionButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

// 빈 상태 메시지
export const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.darkMode ? '#9ca3af' : '#6b7280'};
`;

// 버튼 래퍼
export const ButtonWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

// 아이콘 컨테이너
export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  color: #6b7280;
  margin-right: 0.5rem;
`;

// 폼 그리드
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

// 체크박스 컨테이너
export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
`;

// 체크박스 입력
export const CheckboxInput = styled.input`
  margin-right: 0.5rem;
  height: 1rem;
  width: 1rem;
  border-radius: 0.25rem;
`;

// 체크박스 레이블
export const CheckboxLabel = styled.label`
  font-size: 0.875rem;
  color: inherit;
`;