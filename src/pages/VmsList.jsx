import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { VmsService } from '../services/ApiService';
import { Card, LoadingState, Alert, Button, Modal, FormField, Select } from '../components/CommonComponents';
import { RefreshCw, Plus, Server, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

// 스타일드 컴포넌트 정의
const PageContainer = styled.div`
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

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const TableContainer = styled.div`
  overflow-x-auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.darkMode ? '#374151' : '#f9fafb'};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.darkMode ? '#374151' : '#e5e7eb'};
  
  &:hover {
    background-color: ${({ theme }) => theme.darkMode ? '#374151' : '#f3f4f6'};
  }
`;

const TableHeader = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  color: ${({ theme }) => theme.darkMode ? '#9ca3af' : '#6b7280'};
`;

const TableCell = styled.td`
  padding: 1rem;
  vertical-align: middle;
  color: ${({ theme }) => theme.colors.text};
`;

const StatusBadge = styled.span`
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

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.darkMode ? '#9ca3af' : '#6b7280'};
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const VmsList = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [vmsData, setVmsData] = useState([]);
    const [error, setError] = useState(null);
    const [syncStatus, setSyncStatus] = useState({ isSync: false, message: '', type: null });

    // 모달 상태
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' 또는 'edit'
    const [currentVms, setCurrentVms] = useState(null);

    // 폼 상태
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        username: '',
        password: '',
        ip: '',
        port: '',
        isActive: true
    });

    const vmsTypes = ['emstone', 'naiz', 'dahua'];

    useEffect(() => {
        fetchVmsData();
    }, []);

    const fetchVmsData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // TODO: 실제 API 엔드포인트로 변경 (예시 데이터 사용)
            const sampleData = [
                {
                    id: '1',
                    name: 'Emstone VMS',
                    type: 'emstone',
                    username: 'admin',
                    password: '********',
                    ip: '192.168.182.200',
                    port: '80',
                    isActive: true,
                    createdAt: '2023-04-08T10:00:00',
                    updatedAt: '2023-04-08T10:00:00'
                },
                {
                    id: '2',
                    name: 'Naiz VMS',
                    type: 'naiz',
                    username: 'admin',
                    password: '********',
                    ip: 'naiz.re.kr',
                    port: '8002',
                    isActive: true,
                    createdAt: '2023-04-07T10:00:00',
                    updatedAt: '2023-04-07T10:00:00'
                },
                {
                    id: '3',
                    name: 'Dahua NVR',
                    type: 'dahua',
                    username: 'admin',
                    password: '********',
                    ip: '192.168.1.100',
                    port: '443',
                    isActive: false,
                    createdAt: '2023-04-06T10:00:00',
                    updatedAt: '2023-04-06T10:00:00'
                }
            ];

            setVmsData(sampleData);
        } catch (err) {
            console.error('Failed to fetch VMS data:', err);
            setError('VMS 데이터를 가져오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSyncVms = async (vmsType) => {
        setSyncStatus({ isSync: true, message: `${vmsType} VMS 동기화 중...`, type: vmsType });

        try {
            const response = await VmsService.synchronizeVms(vmsType);
            setSyncStatus({
                isSync: false,
                message: `${vmsType} VMS 동기화가 완료되었습니다.`,
                type: null
            });

            // 데이터 갱신
            fetchVmsData();
        } catch (err) {
            console.error(`Failed to synchronize VMS ${vmsType}:`, err);
            setSyncStatus({
                isSync: false,
                message: `${vmsType} VMS 동기화 중 오류가 발생했습니다: ${err.message || '알 수 없는 오류'}`,
                type: null
            });
        }
    };

    const openAddModal = () => {
        setModalMode('add');
        setFormData({
            name: '',
            type: '',
            username: '',
            password: '',
            ip: '',
            port: '',
            isActive: true
        });
        setIsModalOpen(true);
    };

    const openEditModal = (vms) => {
        setModalMode('edit');
        setCurrentVms(vms);
        setFormData({
            name: vms.name,
            type: vms.type,
            username: vms.username,
            password: '', // 보안상 비밀번호는 비워둠
            ip: vms.ip,
            port: vms.port,
            isActive: vms.isActive
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async () => {
        // TODO: 실제 API 호출 구현
        if (modalMode === 'add') {
            // 샘플 추가 로직
            const newVms = {
                id: Date.now().toString(),
                ...formData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            setVmsData([...vmsData, newVms]);
        } else {
            // 샘플 수정 로직
            const updatedVmsData = vmsData.map(vms =>
                vms.id === currentVms.id ? {
                    ...vms,
                    ...formData,
                    password: formData.password || vms.password, // 비밀번호가 변경되지 않았다면 기존 값 유지
                    updatedAt: new Date().toISOString()
                } : vms
            );
            setVmsData(updatedVmsData);
        }

        setIsModalOpen(false);
    };

    const handleToggleActive = async (vms) => {
        // TODO: 실제 API 호출 구현
        const updatedVmsData = vmsData.map(item =>
            item.id === vms.id ? { ...item, isActive: !item.isActive } : item
        );
        setVmsData(updatedVmsData);
    };

    const handleDelete = async (vmsId) => {
        if (window.confirm('정말로 이 VMS를 삭제하시겠습니까?')) {
            // TODO: 실제 API 호출 구현
            const updatedVmsData = vmsData.filter(vms => vms.id !== vmsId);
            setVmsData(updatedVmsData);
        }
    };

    if (isLoading) {
        return <LoadingState message="VMS 정보를 불러오는 중입니다..." />;
    }

    return (
        <PageContainer>
            <HeaderContainer>
                <Title>VMS 관리</Title>
                <ButtonWrapper>
                    <Button
                        variant="outline"
                        onClick={fetchVmsData}
                        icon={<RefreshCw size={16} />}
                    >
                        새로고침
                    </Button>
                    <Button
                        variant="primary"
                        onClick={openAddModal}
                        icon={<Plus size={16} />}
                    >
                        VMS 추가
                    </Button>
                </ButtonWrapper>
            </HeaderContainer>

            {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

            {syncStatus.message && (
                <Alert
                    type={syncStatus.isSync ? "info" : "success"}
                    message={syncStatus.message}
                    onClose={() => setSyncStatus({ ...syncStatus, message: '' })}
                />
            )}

            <Card>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <tr>
                                <TableHeader>이름</TableHeader>
                                <TableHeader>유형</TableHeader>
                                <TableHeader>IP 주소</TableHeader>
                                <TableHeader>포트</TableHeader>
                                <TableHeader>상태</TableHeader>
                                <TableHeader>마지막 업데이트</TableHeader>
                                <TableHeader style={{ textAlign: 'right' }}>작업</TableHeader>
                            </tr>
                        </TableHead>
                        <tbody>
                            {vmsData.map((vms) => (
                                <TableRow key={vms.id}>
                                    <TableCell>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <Server style={{ color: '#6b7280', marginRight: '0.5rem' }} size={16} />
                                            <div style={{ fontWeight: 500 }}>{vms.name}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span style={{
                                            display: 'inline-flex',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            backgroundColor: '#dbeafe',
                                            color: '#1d4ed8'
                                        }}>
                                            {vms.type}
                                        </span>
                                    </TableCell>
                                    <TableCell>{vms.ip}</TableCell>
                                    <TableCell>{vms.port}</TableCell>
                                    <TableCell>
                                        <StatusBadge $active={vms.isActive}>
                                            {vms.isActive ? (
                                                <>
                                                    <CheckCircle size={12} style={{ marginRight: '0.25rem' }} />
                                                    활성화
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle size={12} style={{ marginRight: '0.25rem' }} />
                                                    비활성화
                                                </>
                                            )}
                                        </StatusBadge>
                                    </TableCell>
                                    <TableCell>{new Date(vms.updatedAt).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <ActionButtonGroup>
                                            <Button
                                                variant="secondary"
                                                size="small"
                                                onClick={() => handleSyncVms(vms.type)}
                                                disabled={syncStatus.isSync && syncStatus.type === vms.type}
                                                icon={<RefreshCw size={14} style={{ animation: syncStatus.isSync && syncStatus.type === vms.type ? 'spin 1s linear infinite' : 'none' }} />}
                                            >
                                                동기화
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="small"
                                                onClick={() => openEditModal(vms)}
                                                icon={<Edit size={14} />}
                                            >
                                                수정
                                            </Button>
                                            <Button
                                                variant={vms.isActive ? "danger" : "success"}
                                                size="small"
                                                onClick={() => handleToggleActive(vms)}
                                                icon={vms.isActive ? <XCircle size={14} /> : <CheckCircle size={14} />}
                                            >
                                                {vms.isActive ? "비활성화" : "활성화"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="small"
                                                onClick={() => handleDelete(vms.id)}
                                                icon={< Trash2 size={14} />}
                                                style={{ color: '#ef4444', hover: { color: '#dc2626' } }}
                                            >
                                                삭제
                                            </Button >
                                        </ActionButtonGroup >
                                    </TableCell >
                                </TableRow >
                            ))}
                            {
                                vmsData.length === 0 && (
                                    <tr>
                                        <TableCell colSpan={7}>
                                            <EmptyState>
                                                등록된 VMS가 없습니다.
                                            </EmptyState>
                                        </TableCell>
                                    </tr>
                                )
                            }
                        </tbody >
                    </Table >
                </TableContainer >
            </Card >

            {/* VMS 추가/수정 모달 */}
            < Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'add' ? 'VMS 추가' : 'VMS 수정'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                            취소
                        </Button>
                        <Button variant="primary" onClick={handleSubmit}>
                            {modalMode === 'add' ? '추가' : '수정'}
                        </Button>
                    </>
                }
            >
                <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <FormField
                        label="VMS 이름"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="VMS 이름을 입력하세요"
                        required
                    />

                    <Select
                        label="VMS 유형"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        options={vmsTypes.map(type => ({ value: type, label: type }))}
                        placeholder="VMS 유형을 선택하세요"
                        required
                    />

                    <FormField
                        label="사용자 이름"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="관리자 계정 이름"
                        required
                    />

                    <FormField
                        label="비밀번호"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder={modalMode === 'edit' ? "변경하지 않으려면 비워두세요" : "비밀번호를 입력하세요"}
                        required={modalMode === 'add'}
                    />

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1rem'
                    }}>
                        <FormField
                            label="IP 주소"
                            name="ip"
                            value={formData.ip}
                            onChange={handleInputChange}
                            placeholder="192.168.0.1"
                            required
                        />

                        <FormField
                            label="포트"
                            name="port"
                            value={formData.port}
                            onChange={handleInputChange}
                            placeholder="80"
                            required
                        />
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '0.5rem'
                    }}>
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            style={{
                                marginRight: '0.5rem',
                                height: '1rem',
                                width: '1rem',
                                borderRadius: '0.25rem'
                            }}
                        />
                        <label
                            htmlFor="isActive"
                            style={{
                                fontSize: '0.875rem',
                                color: 'inherit'
                            }}
                        >
                            활성화
                        </label>
                    </div>
                </form>
            </Modal >
        </PageContainer >
    );
};

export default VmsList;