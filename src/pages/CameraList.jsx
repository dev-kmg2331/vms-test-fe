import React, { useState, useEffect } from 'react';
import { Card, LoadingState, Alert, Button, Modal, Select } from '../components/CommonComponents';
import { CameraService, VmsService } from '../services/ApiService';
import { RefreshCw, Eye, Camera, Filter, Search, CheckCircle, XCircle } from 'lucide-react';

export const CamerasList = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [cameras, setCameras] = useState([]);
    const [error, setError] = useState(null);
    const [vmsTypes, setVmsTypes] = useState([]);
    const [selectedVmsType, setSelectedVmsType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [syncStatus, setSyncStatus] = useState({ isSync: false, message: '' });

    // 카메라 세부 정보 모달
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

            // 샘플 데이터 (API 응답이 없을 경우)
            if (!camerasData || camerasData.length === 0) {
                // 샘플 데이터 생성
                camerasData = Array.from({ length: 15 }, (_, i) => ({
                    id: `cam-${i + 1}`,
                    name: `카메라 ${i + 1}`,
                    channelID: `${i + 1}`,
                    channelName: `채널 ${i + 1}`,
                    ipAddress: `192.168.1.${10 + i}`,
                    port: 554,
                    rtspUrl: `rtsp://admin:password@192.168.1.${10 + i}/stream1`,
                    isEnabled: i % 5 !== 0, // 일부는 비활성화 상태로
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

            // 카메라 목록 다시 불러오기
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

    // 검색 및 필터링된 카메라 목록
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">카메라 관리</h1>
                <Button
                    variant="primary"
                    onClick={() => fetchCameras(selectedVmsType)}
                    icon={<RefreshCw size={16} />}
                >
                    새로고침
                </Button>
            </div>

            {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

            {syncStatus.message && (
                <Alert
                    type={syncStatus.isSync ? "info" : "success"}
                    message={syncStatus.message}
                    onClose={() => setSyncStatus({ ...syncStatus, message: '' })}
                />
            )}

            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="w-full md:w-64">
                    <Select
                        value={selectedVmsType}
                        onChange={handleVmsTypeChange}
                        options={[
                            { value: '', label: '전체 VMS' },
                            ...vmsTypes.map(type => ({ value: type, label: type }))
                        ]}
                    />
                </div>

                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm"
                        placeholder="카메라 검색..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>

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
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    이름
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    채널 ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    IP 주소
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    상태
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    기능
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    VMS
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    작업
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredCameras.map((camera) => (
                                <tr key={camera.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Camera className="text-gray-500 mr-2" size={16} />
                                            <div className="font-medium">{camera.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">{camera.channelID}</div>
                                        <div className="text-xs text-gray-500">{camera.channelName}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">{camera.ipAddress}</div>
                                        <div className="text-xs text-gray-500">포트: {camera.port}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${camera.isEnabled ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                            {camera.isEnabled ? (
                                                <>
                                                    <CheckCircle size={12} className="mr-1" />
                                                    {camera.status || '활성화'}
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle size={12} className="mr-1" />
                                                    비활성화
                                                </>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex space-x-1">
                                            {camera.supportsPTZ && (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    PTZ
                                                </span>
                                            )}
                                            {camera.supportsAudio && (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                                    오디오
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                                            {camera.vms}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        {searchQuery || selectedVmsType
                                            ? '검색 결과가 없습니다.'
                                            : '등록된 카메라가 없습니다.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* 카메라 상세 정보 모달 */}
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
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">카메라 이름</h4>
                                <p className="mt-1">{selectedCamera.name}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">VMS 유형</h4>
                                <p className="mt-1">{selectedCamera.vms}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">채널 ID</h4>
                                <p className="mt-1">{selectedCamera.channelID}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">채널 이름</h4>
                                <p className="mt-1">{selectedCamera.channelName}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">IP 주소</h4>
                                <p className="mt-1">{selectedCamera.ipAddress}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">포트</h4>
                                <p className="mt-1">{selectedCamera.port}</p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">RTSP URL</h4>
                            <p className="mt-1 text-sm break-all font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded">
                                {selectedCamera.rtspUrl}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">상태</h4>
                                <p className="mt-1 flex items-center">
                                    {selectedCamera.isEnabled ? (
                                        <span className="flex items-center text-green-600">
                                            <CheckCircle size={16} className="mr-1" />
                                            활성화
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-red-600">
                                            <XCircle size={16} className="mr-1" />
                                            비활성화
                                        </span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">기능</h4>
                                <p className="mt-1">
                                    {selectedCamera.supportsPTZ && (
                                        <span className="mr-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                                            PTZ 지원
                                        </span>
                                    )}
                                    {selectedCamera.supportsAudio && (
                                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
                                            오디오 지원
                                        </span>
                                    )}
                                    {!selectedCamera.supportsPTZ && !selectedCamera.supportsAudio && '기본 기능'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">원본 ID</h4>
                                <p className="mt-1">{selectedCamera.originalId}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">마지막 업데이트</h4>
                                <p className="mt-1">{new Date(selectedCamera.updatedAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CamerasList;