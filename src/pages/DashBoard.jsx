import React, {useState, useEffect} from 'react';
import {RefreshCw, Server, Camera, Activity} from 'lucide-react';
import {VmsService, CameraService} from '../services/ApiService';
import {Card, LoadingState, Alert, Button} from '../components/CommonComponents';
import {
    DashboardContainer,
    HeaderContainer,
    Title,
    GridContainer,
    StatItem,
    StatInfo,
    StatIconWrapper,
    StatContent,
    StatLabel,
    StatValue,
    StatSubtext,
    StatList,
    StatListItem,
    StatTypeLabel,
    StatCount,
    SystemStatusItem,
    StatusLabel,
    StatusValue
} from './styles/DashboardStyles';

export const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vmsTypes, setVmsTypes] = useState([]);
    const [cameraStats, setCameraStats] = useState({total: 0, byType: {}});
    const [syncStatus, setSyncStatus] = useState({isSync: false, message: ''});

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
            const stats = {total: allCameras.length, byType: {}};

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
        setSyncStatus({isSync: true, message: '모든 VMS 동기화 중...'});

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
        return <LoadingState message="대시보드 정보를 불러오는 중입니다..."/>;
    }

    return (
        <DashboardContainer>
            <HeaderContainer>
                <Title>VMS 관리 시스템 대시보드</Title>
                <Button
                    variant="primary"
                    onClick={fetchDashboardData}
                    icon={<RefreshCw size={16}/>}
                >
                    새로고침
                </Button>
            </HeaderContainer>

            {error && <Alert type="error" message={error} onClose={() => setError(null)}/>}

            {syncStatus.message && (
                <Alert
                    type={syncStatus.isSync ? "info" : "success"}
                    message={syncStatus.message}
                    onClose={() => setSyncStatus({...syncStatus, message: ''})}
                />
            )}

            <GridContainer>
                {/* VMS 통계 */}
                <Card title="VMS 시스템 현황">
                    <StatItem>
                        <StatInfo>
                            <StatIconWrapper>
                                <Server size={24} color="#3b82f6"/>
                            </StatIconWrapper>
                            <StatContent>
                                <StatLabel>등록된 VMS 수</StatLabel>
                                <StatValue>{vmsTypes.length}</StatValue>
                            </StatContent>
                        </StatInfo>
                        <Button
                            variant="outline"
                            size="small"
                            onClick={handleSyncAll}
                            disabled={syncStatus.isSync}
                            icon={<RefreshCw size={16} className={syncStatus.isSync ? "animate-spin" : ""}/>}
                        >
                            전체 동기화
                        </Button>
                    </StatItem>

                    <StatList>
                        {vmsTypes.map((vms, index) => (
                            <StatListItem key={index}>
                                <span>{vms}</span>
                            </StatListItem>
                        ))}
                    </StatList>
                </Card>

                {/* 카메라 통계 */}
                <Card title="카메라 현황">
                    <StatItem>
                        <StatInfo>
                            <StatIconWrapper color="#22c55e">
                                <Camera size={24} color="#22c55e"/>
                            </StatIconWrapper>
                            <StatContent>
                                <StatLabel>등록된 카메라 수</StatLabel>
                                <StatValue>{cameraStats.total}</StatValue>
                            </StatContent>
                        </StatInfo>
                    </StatItem>

                    <StatList>
                        {Object.entries(cameraStats.byType).map(([type, count]) => (
                            <StatListItem key={type}>
                                <StatTypeLabel>{type}</StatTypeLabel>
                                <StatCount>{count}대</StatCount>
                            </StatListItem>
                        ))}
                    </StatList>
                </Card>

                {/* 시스템 상태 */}
                <Card title="시스템 상태">
                    <StatItem>
                        <StatInfo>
                            <StatIconWrapper color="#a855f7">
                                <Activity size={24} color="#a855f7"/>
                            </StatIconWrapper>
                            <StatContent>
                                <StatLabel>시스템 작동 중</StatLabel>
                                <StatSubtext>최근 업데이트: {new Date().toLocaleString()}</StatSubtext>
                            </StatContent>
                        </StatInfo>
                    </StatItem>

                    <StatList>
                        <SystemStatusItem>
                            <StatusLabel>API 연결 상태</StatusLabel>
                            <StatusValue color="#22c55e">정상</StatusValue>
                        </SystemStatusItem>
                        <SystemStatusItem>
                            <StatusLabel>DB 연결 상태</StatusLabel>
                            <StatusValue color="#22c55e">정상</StatusValue>
                        </SystemStatusItem>
                        <SystemStatusItem>
                            <StatusLabel>마지막 동기화</StatusLabel>
                            <StatusValue>최근 15분 이내</StatusValue>
                        </SystemStatusItem>
                    </StatList>
                </Card>
            </GridContainer>
        </DashboardContainer>
    );
};

export default Dashboard;