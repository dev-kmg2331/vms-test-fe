import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import {CameraService, VmsCameraService, VmsService} from '../services/ApiService';
import { Button, Alert, Select } from '../components/CommonComponents';
import styled from 'styled-components';

const SynchronizerContainer = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const SynchronizerHeader = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
`;

const SynchronizerDescription = styled.p`
  margin-bottom: 1rem;
  color: #666;
  font-size: 0.9rem;
`;

const FormContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SelectWrapper = styled.div`
  flex: 1;
`;

/**
 * VMS 선택 및 동기화 컴포넌트
 * 
 * 이 컴포넌트는 VMS 유형을 선택하고 해당 VMS의 카메라 데이터를 
 * 통합 카메라 구조로 동기화하는 기능을 제공합니다.
 */
const VmsSynchronizer = ({ vmsTypes = [] }) => {
  const [selectedVmsType, setSelectedVmsType] = useState('');
  const [syncStatus, setSyncStatus] = useState({ isSync: false, message: '', type: 'info' });

  const handleVmsTypeChange = (e) => {
    setSelectedVmsType(e.target.value);
  };

  const handleSyncVms = async () => {
    if (!selectedVmsType) {
      setSyncStatus({ isSync: false, message: 'VMS 유형을 선택해주세요.', type: 'error' });
      return;
    }

    setSyncStatus({ isSync: true, message: `${selectedVmsType} VMS 동기화 중...`, type: 'info' });

    try {
      await CameraService.synchronizeCameras(selectedVmsType);
      setSyncStatus({
        isSync: false,
        message: `${selectedVmsType} VMS 동기화가 완료되었습니다.`,
        type: 'success'
      });
    } catch (err) {
      console.error(`Failed to synchronize VMS ${selectedVmsType}:`, err);
      setSyncStatus({
        isSync: false,
        message: `${selectedVmsType} VMS 동기화 중 오류가 발생했습니다: ${err.message || '알 수 없는 오류'}`,
        type: 'error'
      });
    }
  };

  return (
    <SynchronizerContainer>
      <SynchronizerHeader>VMS 카메라 동기화</SynchronizerHeader>
      <SynchronizerDescription>
        선택한 VMS 시스템의 카메라 데이터를 통합 카메라 구조로 동기화합니다.
      </SynchronizerDescription>

      {syncStatus.message && (
        <Alert
          type={syncStatus.type}
          message={syncStatus.message}
          onClose={() => setSyncStatus({ ...syncStatus, message: '' })}
        />
      )}

      <FormContainer>
        <SelectWrapper>
          <Select
            label="VMS 유형"
            value={selectedVmsType}
            onChange={handleVmsTypeChange}
            options={vmsTypes.map(type => ({ value: type, label: type }))}
            placeholder="VMS 유형을 선택하세요"
          />
        </SelectWrapper>
        <Button
          variant="primary"
          onClick={handleSyncVms}
          disabled={syncStatus.isSync || !selectedVmsType}
          icon={<RefreshCw size={16} style={{ animation: syncStatus.isSync ? 'spin 1s linear infinite' : 'none' }} />}
        >
          선택 VMS 동기화
        </Button>
      </FormContainer>
    </SynchronizerContainer>
  );
};

export default VmsSynchronizer;
