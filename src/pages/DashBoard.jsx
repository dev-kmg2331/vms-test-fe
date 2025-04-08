import React, { useState, useEffect } from 'react';
import { Card, LoadingState, Alert, Button } from '../components/CommonComponents';
import { VmsService, CameraService } from '../services/ApiService';
import { RefreshCw, Server, Camera, Activity } from 'lucide-react';

export const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vmsTypes, setVmsTypes] = useState([]);
    const [cameraStats, setCameraStats] = useState({ total: 0, byType: {} });
    const [syncStatus, setSyncStatus] = useState({ isSync: false, message: '' });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // VMS 유형 가져오기
            const vmsTypesData = await VmsService.getAllVmsTypes();
            setVmsTypes(vmsTypesData);

            // 모든 카메라 가져오기
            const allCameras = await CameraService.getAllCameras();

            // 카메라 통계 계산
            const stats = { total: allCameras.length, byType: {} };

            // VMS 유형별 카메라 수 계산
            allCameras.forEach(camera => {
                if (!stats.byType[camera.vms]) {
                    stats.byType[camera.vms] = 0;
                }
                stats.byType[camera.vms]++;
            });

            setCameraStats(stats);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError('대시보드 데이터를 가져오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSyncAll = async () => {
        setSyncStatus({ isSync: true, message: '모든 VMS 동기화 중...' });

        try {
            const response = await VmsService.synchronizeAllVms();
            setSyncStatus({
                isSync: false,
                message: '모든 VMS 동기화가 완료되었습니다.'
            });

            // 대시보드 데이터 갱신
            fetchDashboardData();
        } catch (err) {
            console.error('Failed to synchronize all VMS:', err);
            setSyncStatus({
                isSync: false,
                message: '동기화 중 오류가 발생했습니다: ' + (err.message || '알 수 없는 오류')
            });
        }
    };

    if (isLoading) {
        return <LoadingState message="대시보드 정보를 불러오는 중입니다..." />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">VMS 관리 시스템 대시보드</h1>
                <Button
                    variant="primary"
                    onClick={fetchDashboardData}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* VMS 통계 */}
                <Card
                    title="VMS 시스템 현황"
                    className="col-span-1"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <Server className="text-blue-500 mr-2" size={24} />
                            <div>
                                <h4 className="font-medium">등록된 VMS 수</h4>
                                <p className="text-2xl font-bold">{vmsTypes.length}</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="small"
                            onClick={handleSyncAll}
                            disabled={syncStatus.isSync}
                            icon={<RefreshCw size={16} className={syncStatus.isSync ? "animate-spin" : ""} />}
                        >
                            전체 동기화
                        </Button>
                    </div>

                    <ul className="space-y-2">
                        {vmsTypes.map((vms, index) => (
                            <li key={index} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                                <span>{vms}</span>
                            </li>
                        ))}
                    </ul>
                </Card>

                {/* 카메라 통계 */}
                <Card
                    title="카메라 현황"
                    className="col-span-1"
                >
                    <div className="flex items-center mb-4">
                        <Camera className="text-green-500 mr-2" size={24} />
                        <div>
                            <h4 className="font-medium">등록된 카메라 수</h4>
                            <p className="text-2xl font-bold">{cameraStats.total}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {Object.entries(cameraStats.byType).map(([type, count]) => (
                            <div key={type} className="flex justify-between items-center">
                                <span className="text-gray-600 dark:text-gray-400">{type}</span>
                                <span className="font-medium">{count}대</span>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* 시스템 상태 */}
                <Card
                    title="시스템 상태"
                    className="col-span-1"
                >
                    <div className="flex items-center mb-4">
                        <Activity className="text-purple-500 mr-2" size={24} />
                        <div>
                            <h4 className="font-medium">시스템 작동 중</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">최근 업데이트: {new Date().toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">API 연결 상태</span>
                            <span className="text-green-500 font-medium">정상</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">DB 연결 상태</span>
                            <span className="text-green-500 font-medium">정상</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400">마지막 동기화</span>
                            <span className="font-medium">최근 15분 이내</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;