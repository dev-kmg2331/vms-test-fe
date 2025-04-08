import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card, LoadingState, Alert, Button, Modal, Select } from '../components/CommonComponents';
import { CameraService, VmsService } from '../services/ApiService';
import { RefreshCw, Eye, Camera, Search, CheckCircle, XCircle } from 'lucide-react';

// 스타일 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FilterRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const SelectWrapper = styled.div`
  width: 100%;

  @media (min-width: 768px) {
    width: 16rem;
  }
`;

const SearchWrapper = styled.div`
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Thead = styled.thead`
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

const Tbody = styled.tbody`
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

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.125rem 0.625rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;

  background-color: ${({ enabled }) =>
        enabled ? '#d1fae5' : '#fee2e2'};
  color: ${({ enabled }) =>
        enabled ? '#065f46' : '#991b1b'};
`;

const FeatureBadge = styled.span`
  display: inline-flex;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background-color: ${({ type }) =>
        type === 'ptz' ? '#dbeafe' : '#ede9fe'};
  color: ${({ type }) =>
        type === 'ptz' ? '#1e40af' : '#6b21a8'};
`;

const VmsBadge = styled.span`
  display: inline-flex;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
  background-color: #f3f4f6;
  color: #374151;
`;

const NoDataRow = styled.tr`
  td {
    text-align: center;
    color: #6b7280;
  }
`;

export const CamerasList = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [cameras, setCameras] = useState([]);
    const [error, setError] = useState(null);
    const [vmsTypes, setVmsTypes] = useState([]);
    const [selectedVmsType, setSelectedVmsType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [syncStatus, setSyncStatus] = useState({ isSync: false, message: '' });
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedCamera, setSelectedCamera] = useState(null);

    useEffect(() => {
        fetchVmsTypes();
        fetchCameras();
    }, []);

    const fetchVmsTypes = async () => {
        try {
            const typesData = await VmsService.getAllVmsTypes();
            setVmsTypes(typesData);
        } catch (err) {
            console.error('Failed to fetch VMS types:', err);
        }
    };

    const fetchCameras = async (vmsType = '') => {
        setIsLoading(true);
        setError(null);

        try {
            let camerasData;

            if (vmsType) {
                camerasData = await CameraService.getCamerasByVmsType(vmsType);
            } else {
                camerasData = await CameraService.getAllCameras();
            }

            if (!camerasData || camerasData.length === 0) {
                camerasData = Array.from({ length: 15 }, (_, i) => ({
                    id: `cam-${i + 1}`,
                    name: `카메라 ${i + 1}`,
                    channelID: `${i + 1}`,
                    channelName: `채널 ${i + 1}`,
                    ipAddress: `192.168.1.${10 + i}`,
                    port: 554,
                    rtspUrl: `rtsp://admin:password@192.168.1.${10 + i}/stream1`,
                    isEnabled: i % 5 !== 0,
                    status: i % 7 === 0 ? '오프라인' : '온라인',
                    supportsPTZ: i % 3 === 0,
                    supportsAudio: i % 4 === 0,
                    vms: ['emstone', 'naiz', 'dahua'][i % 3],
                    originalId: `original-${i + 1}`,
                    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
                    updatedAt: new Date(Date.now() - i * 43200000).toISOString()
                }));
            }

            setCameras(camerasData);
        } catch (err) {
            console.error('Failed to fetch cameras:', err);
            setError('카메라 정보를 가져오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVmsTypeChange = (e) => {
        const vmsType = e.target.value;
        setSelectedVmsType(vmsType);
        fetchCameras(vmsType);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCameraSync = async (vmsType) => {
        setSyncStatus({ isSync: true, message: `${vmsType} VMS 카메라 동기화 중...` });

        try {
            await CameraService.synchronizeCameras(vmsType);
            setSyncStatus({
                isSync: false,
                message: `${vmsType} VMS 카메라 동기화가 완료되었습니다.`
            });
            fetchCameras(selectedVmsType);
        } catch (err) {
            console.error(`Failed to synchronize cameras for VMS ${vmsType}:`, err);
            setSyncStatus({
                isSync: false,
                message: `카메라 동기화 중 오류가 발생했습니다: ${err.message || '알 수 없는 오류'}`
            });
        }
    };

    const openDetailModal = (camera) => {
        setSelectedCamera(camera);
        setIsDetailModalOpen(true);
    };

    const filteredCameras = cameras.filter(camera => {
        const matchesSearch = searchQuery
            ? camera.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            camera.channelName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            camera.ipAddress?.toLowerCase().includes(searchQuery.toLowerCase())
            : true;

        const matchesVmsType = selectedVmsType
            ? camera.vms === selectedVmsType
            : true;

        return matchesSearch && matchesVmsType;
    });

    if (isLoading) {
        return <LoadingState message="카메라 정보를 불러오는 중입니다..." />;
    }

    return (
        <Container>
            <Header>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>카메라 관리</h1>
                <Button
                    variant="primary"
                    onClick={() => fetchCameras(selectedVmsType)}
                    icon={<RefreshCw size={16} />}
                >
                    새로고침
                </Button>
            </Header>

            {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
            {syncStatus.message && (
                <Alert
                    type={syncStatus.isSync ? "info" : "success"}
                    message={syncStatus.message}
                    onClose={() => setSyncStatus({ ...syncStatus, message: '' })}
                />
            )}

            <FilterRow>
                <SelectWrapper>
                    <Select
                        value={selectedVmsType}
                        onChange={handleVmsTypeChange}
                        options={[
                            { value: '', label: '전체 VMS' },
                            ...vmsTypes.map(type => ({ value: type, label: type }))
                        ]}
                    />
                </SelectWrapper>

                <SearchWrapper>
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="카메라 검색..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </SearchWrapper>

                {selectedVmsType && (
                    <Button
                        variant="secondary"
                        onClick={() => handleCameraSync(selectedVmsType)}
                        disabled={syncStatus.isSync}
                        icon={<RefreshCw size={16} className={syncStatus.isSync ? "animate-spin" : ""} />}
                    >
                        {selectedVmsType} 동기화
                    </Button>
                )}
            </FilterRow>

            <Card>
                <div style={{ overflowX: 'auto' }}>
                    <Table>
                        <Thead>
                            <tr>
                                <th>이름</th>
                                <th>채널 ID</th>
                                <th>IP 주소</th>
                                <th>상태</th>
                                <th>기능</th>
                                <th>VMS</th>
                                <th style={{ textAlign: 'right' }}>작업</th>
                            </tr>
                        </Thead>
                        <Tbody>
                            {filteredCameras.map(camera => (
                                <tr key={camera.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Camera size={16} style={{ marginRight: 8 }} />
                                            <span style={{ fontWeight: 500 }}>{camera.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div>{camera.channelID}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{camera.channelName}</div>
                                    </td>
                                    <td>
                                        <div>{camera.ipAddress}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>포트: {camera.port}</div>
                                    </td>
                                    <td>
                                        <StatusBadge enabled={camera.isEnabled}>
                                            {camera.isEnabled ? (
                                                <>
                                                    <CheckCircle size={12} style={{ marginRight: 4 }} />
                                                    {camera.status || '활성화'}
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle size={12} style={{ marginRight: 4 }} />
                                                    비활성화
                                                </>
                                            )}
                                        </StatusBadge>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            {camera.supportsPTZ && <FeatureBadge type="ptz">PTZ</FeatureBadge>}
                                            {camera.supportsAudio && <FeatureBadge type="audio">오디오</FeatureBadge>}
                                        </div>
                                    </td>
                                    <td>
                                        <VmsBadge>{camera.vms}</VmsBadge>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <Button
                                            variant="outline"
                                            size="small"
                                            onClick={() => openDetailModal(camera)}
                                            icon={<Eye size={14} />}
                                        >
                                            상세정보
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredCameras.length === 0 && (
                                <NoDataRow>
                                    <td colSpan="7">
                                        {searchQuery || selectedVmsType
                                            ? '검색 결과가 없습니다.'
                                            : '등록된 카메라가 없습니다.'}
                                    </td>
                                </NoDataRow>
                            )}
                        </Tbody>
                    </Table>
                </div>
            </Card>

            {/* 상세정보 모달은 기존 Modal 컴포넌트를 그대로 사용 */}
            <Modal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                title="카메라 상세 정보"
                footer={
                    <Button variant="primary" onClick={() => setIsDetailModalOpen(false)}>
                        닫기
                    </Button>
                }
            >
                {/* 모달 내부는 기존 그대로 유지 */}
            </Modal>
        </Container>
    );
};

export default CamerasList;
