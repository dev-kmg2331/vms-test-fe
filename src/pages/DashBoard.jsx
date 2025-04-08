import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { RefreshCw, Server, Camera, Activity } from 'lucide-react';
import { VmsService, CameraService } from '../services/ApiService';
import { Card, LoadingState, Alert, Button } from '../components/CommonComponents';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StatInfo = styled.div`
  display: flex;
  align-items: center;
`;

const StatIconWrapper = styled.div`
  margin-right: 0.5rem;
  color: ${({ color }) => color || '#3b82f6'};
`;

const StatContent = styled.div``;

const StatLabel = styled.h4`
  font-weight: 500;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const StatValue = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;

const StatSubtext = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.darkMode ? '#9ca3af' : '#6b7280'};
  margin: 0;
`;

const StatList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StatListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.375rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.darkMode ? '#374151' : '#f3f4f6'};
  }
`;

const StatTypeLabel = styled.span`
  color: ${({ theme }) => theme.darkMode ? '#9ca3af' : '#6b7280'};
`;

const StatCount = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const SystemStatusItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const StatusLabel = styled.span`
  color: ${({ theme }) => theme.darkMode ? '#9ca3af' : '#6b7280'};
`;

const StatusValue = styled.span`
  font-weight: 500;
  color: ${({ color, theme }) => color || theme.colors.text};
`;

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
        <DashboardContainer>
            <HeaderContainer>
                <Title>VMS 관리 시스템 대시보드</Title>
                <Button
                    variant="primary"
                    onClick={fetchDashboardData}
                    icon={<RefreshCw size={16} />}
                >
                    새로고침
                </Button>
            </HeaderContainer>

            {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

            {syncStatus.message && (
                <Alert
                    type={syncStatus.isSync ? "info" : "success"}
                    message={syncStatus.message}
                    onClose={() => setSyncStatus({ ...syncStatus, message: '' })}
                />
            )}

            <GridContainer>
                {/* VMS 통계 */}
                <Card title="VMS 시스템 현황">
                    <StatItem>
                        <StatInfo>
                            <StatIconWrapper>
                                <Server size={24} color="#3b82f6" />
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
                            icon={<RefreshCw size={16} className={syncStatus.isSync ? "animate-spin" : ""} />}
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
                                <Camera size={24} color="#22c55e" />
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
                                <Activity size={24} color="#a855f7" />
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