import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, Trash2, Info, HelpCircle } from 'lucide-react';
import { Button, FormField } from '../components/CommonComponents';

// 스타일 컴포넌트
const AdditionalInfoContainer = styled.div`
  margin-top: 1rem;
`;

const AdditionalInfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const AdditionalInfoTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AdditionalInfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AdditionalInfoItem = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
`;

const InfoFields = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  margin-top: 1.5rem;
  
  &:hover {
    background-color: rgba(239, 68, 68, 0.1);
  }
`;

const EmptyInfo = styled.div`
  text-align: center;
  padding: 1.5rem;
  color: #6b7280;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border: 1px dashed #d1d5db;
`;

const Tooltip = styled.div`
  position: relative;
  display: inline-flex;
  cursor: help;
  
  &:hover::before {
    content: attr(data-tooltip);
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.5rem 0.75rem;
    background-color: #1f2937;
    color: white;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    white-space: nowrap;
    z-index: 10;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  &:hover::after {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 5px;
    border-style: solid;
    border-color: #1f2937 transparent transparent transparent;
    z-index: 10;
  }
`;

/**
 * VMS 추가 정보 편집 컴포넌트
 * 
 * VMS 설정의 additionalInfo 필드를 편집하기 위한 UI 컴포넌트
 */
const AdditionalInfoEditor = ({ additionalInfo, onChange }) => {
  const [items, setItems] = useState(additionalInfo || []);

  // 항목 추가
  const handleAddItem = () => {
    const newItem = {
      key: '',
      value: '',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    onChange(updatedItems);
  };

  // 항목 삭제
  const handleDeleteItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    onChange(updatedItems);
  };

  // 항목 변경
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
      updatedAt: new Date().toISOString()
    };
    
    setItems(updatedItems);
    onChange(updatedItems);
  };

  return (
    <AdditionalInfoContainer>
      <AdditionalInfoHeader>
        <AdditionalInfoTitle>
          <Info size={16} />
          추가 정보
          <Tooltip data-tooltip="VMS 특정 설정을 위한 추가 정보를 입력합니다">
            <HelpCircle size={14} />
          </Tooltip>
        </AdditionalInfoTitle>
        <Button
          variant="outline"
          size="small"
          onClick={handleAddItem}
          icon={<Plus size={14} />}
        >
          항목 추가
        </Button>
      </AdditionalInfoHeader>

      <AdditionalInfoList>
        {items.length > 0 ? (
          items.map((item, index) => (
            <AdditionalInfoItem key={index}>
              <InfoFields>
                <FormField
                  label="키"
                  value={item.key}
                  onChange={(e) => handleItemChange(index, 'key', e.target.value)}
                  placeholder="키를 입력하세요"
                  required
                />
                <FormField
                  label="값"
                  value={item.value}
                  onChange={(e) => handleItemChange(index, 'value', e.target.value)}
                  placeholder="값을 입력하세요"
                  required
                />
                <FormField
                  label="설명"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  placeholder="설명을 입력하세요 (선택사항)"
                  style={{ gridColumn: '1 / -1' }}
                />
              </InfoFields>
              <DeleteButton onClick={() => handleDeleteItem(index)}>
                <Trash2 size={16} />
              </DeleteButton>
            </AdditionalInfoItem>
          ))
        ) : (
          <EmptyInfo>
            추가 정보가 없습니다. '항목 추가' 버튼을 클릭하여 정보를 추가하세요.
          </EmptyInfo>
        )}
      </AdditionalInfoList>
    </AdditionalInfoContainer>
  );
};

export default AdditionalInfoEditor;
