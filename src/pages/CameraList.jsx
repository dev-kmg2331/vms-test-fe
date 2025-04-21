import React, { useState, useEffect } from 'react';
import { Card, LoadingState, Alert, Button, Modal, Select } from '../components/CommonComponents';
import { CameraService, VmsService } from '../services/ApiService';
import { RefreshCw, Eye, Camera, Search, CheckCircle, XCircle } from 'lucide-react';
import { 
  Container, 
  Header, 
  FilterRow, 
  SelectWrapper, 
  SearchWrapper, 
  Table, 
  Thead, 
  Tbody, 
  StatusBadge, 
  FeatureBadge, 
  VmsBadge, 
  NoDataRow 
} from './styles/CameraListStyles';

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

            // API 응답 필드 이름 및 구조 맞추기
            // enabled 필드를 isEnabled로 매핑 (UI에서 사용하는 프로퍼티명)
            const processedCameras = (camerasData.content || []).map(camera => ({
                ...camera,
                isEnabled: camera.enabled !== undefined ? camera.enabled : camera.isEnabled
            }));

            setCameras(processedCameras);
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
                                        <div>{camera.ipAddress || '-'}</div>
                                        {camera.port > 0 && 
                                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>포트: {camera.port}</div>
                                        }
                                    </td>
                                    <td>
                                        <StatusBadge enabled={camera.isEnabled}>
                                            {camera.isEnabled ? (
                                                <>
                                                    <CheckCircle size={12} style={{ marginRight: 4 }} />
                                                    활성화
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
                                            {<FeatureBadge active={camera.supportsPTZ} type="ptz">PTZ</FeatureBadge>}
                                            {<FeatureBadge active={camera.supportsAudio} type="audio">오디오</FeatureBadge>}
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
                {selectedCamera && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>기본 정보</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem' }}>
                                <div style={{ fontWeight: '500' }}>ID:</div>
                                <div>{selectedCamera.id}</div>
                                <div style={{ fontWeight: '500' }}>이름:</div>
                                <div>{selectedCamera.name}</div>
                                <div style={{ fontWeight: '500' }}>채널 ID:</div>
                                <div>{selectedCamera.channelID}</div>
                                <div style={{ fontWeight: '500' }}>채널 이름:</div>
                                <div>{selectedCamera.channelName}</div>
                                <div style={{ fontWeight: '500' }}>소스 참조:</div>
                                <div>{selectedCamera.sourceReference?.collectionName} / {selectedCamera.sourceReference?.documentId}</div>
                                <div style={{ fontWeight: '500' }}>원본 ID:</div>
                                <div>{selectedCamera.originalId}</div>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>네트워크 정보</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem' }}>
                                <div style={{ fontWeight: '500' }}>IP 주소:</div>
                                <div>{selectedCamera.ipAddress || '정보 없음'}</div>
                                <div style={{ fontWeight: '500' }}>포트:</div>
                                <div>{selectedCamera.port || '정보 없음'}</div>
                                <div style={{ fontWeight: '500' }}>HTTP 포트:</div>
                                <div>{selectedCamera.httpPort || '정보 없음'}</div>
                                <div style={{ fontWeight: '500' }}>RTSP URL:</div>
                                <div style={{ wordBreak: 'break-all' }}>{selectedCamera.rtspUrl || '정보 없음'}</div>
                                <div style={{ fontWeight: '500' }}>상태 정보:</div>
                                <div>{selectedCamera.status || '정보 없음'}</div>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>기능 정보</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem' }}>
                                <div style={{ fontWeight: '500' }}>PTZ 지원:</div>
                                <div>{selectedCamera.supportsPTZ ? '지원함' : '지원 안함'}</div>
                                <div style={{ fontWeight: '500' }}>오디오 지원:</div>
                                <div>{selectedCamera.supportsAudio ? '지원함' : '지원 안함'}</div>
                                <div style={{ fontWeight: '500' }}>VMS 유형:</div>
                                <div>{selectedCamera.vms}</div>
                                <div style={{ fontWeight: '500' }}>활성화 상태:</div>
                                <div>{selectedCamera.isEnabled ? '활성화' : '비활성화'}</div>
                            </div>
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>시간 정보</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.5rem' }}>
                                <div style={{ fontWeight: '500' }}>생성 시간:</div>
                                <div>{selectedCamera.createdAt}</div>
                                <div style={{ fontWeight: '500' }}>업데이트 시간:</div>
                                <div>{selectedCamera.updatedAt}</div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </Container>
    );
};

export default CamerasList;
