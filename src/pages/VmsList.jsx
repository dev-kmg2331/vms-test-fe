import React, { useState, useEffect } from 'react';
import { VmsService } from '../services/ApiService';
import { Card, LoadingState, Alert, Button, Modal, FormField, Select } from '../components/CommonComponents';
import { RefreshCw, Plus, Server, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import {
    PageContainer,
    HeaderContainer,
    Title,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableCell,
    StatusBadge,
    TypeBadge,
    ActionButtonGroup,
    EmptyState,
    ButtonWrapper,
    IconContainer,
    FormGrid,
    CheckboxContainer,
    CheckboxInput,
    CheckboxLabel
} from './styles/VmsListStyles';

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
        isActive: true,
        additionalInfo: []
    });

    const [vmsTypes, setVmsTypes] = useState([]);

    useEffect(() => {
        fetchVmsTypes();
        fetchVmsData();
    }, []);

    const fetchVmsTypes = async () => {
        try {
            const types = await VmsService.getAllVmsTypes();
            setVmsTypes(types || []);
        } catch (err) {
            console.error('Failed to fetch VMS types:', err);
            setError('VMS 유형 정보를 가져오는 중 오류가 발생했습니다.');
        }
    };

    const fetchVmsData = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // 실제 API 호출로 VMS 설정 데이터 가져오기
            const response = await VmsService.getAllVmsConfigs();
            const configsData = response.rows || [];

            setVmsData(configsData);
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
            type: vmsTypes.length > 0 ? vmsTypes[0] : '',
            username: '',
            password: '',
            ip: '',
            port: '',
            isActive: true,
            additionalInfo: []
        });
        setIsModalOpen(true);
    };

    const openEditModal = (vms) => {
        setModalMode('edit');
        setCurrentVms(vms);
        setFormData({
            name: vms.name || vms.type,
            type: vms.vms || vms.type,
            username: vms.username,
            password: '', // 보안상 비밀번호는 비워둠
            ip: vms.ip,
            port: vms.port,
            isActive: vms.active,
            additionalInfo: vms.additionalInfo || []
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
        try {
            if (modalMode === 'add') {
                // VMS 추가 API 호출
                const configRequest = {
                    username: formData.username,
                    password: formData.password,
                    ip: formData.ip,
                    port: formData.port,
                    additionalInfo: formData.additionalInfo
                };

                await VmsService.updateVmsConfig(formData.type, configRequest);
                setIsModalOpen(false);
                fetchVmsData();

            } else {
                // VMS 수정 API 호출
                const configRequest = {
                    username: formData.username,
                    password: formData.password || null, // 빈 값이면 null 전송 (기존 비밀번호 유지)
                    ip: formData.ip,
                    port: formData.port,
                    additionalInfo: formData.additionalInfo
                };

                await VmsService.updateVmsConfig(currentVms.vms || currentVms.type, configRequest);
                setIsModalOpen(false);
                fetchVmsData();
            }
        } catch (err) {
            console.error('Failed to save VMS config:', err);
            setError('VMS 설정 저장 중 오류가 발생했습니다.');
        }
    };

    const handleToggleActive = async (vms) => {
        console.log(vms)
        try {
            // VMS 활성화 상태 변경 API 호출
            await VmsService.setVmsConfigActive(vms.vms || vms.type, !vms.active);
            fetchVmsData();
        } catch (err) {
            console.error('Failed to toggle VMS active status:', err);
            setError('VMS 활성화 상태 변경 중 오류가 발생했습니다.');
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
                                            <IconContainer>
                                                <Server size={16} />
                                            </IconContainer>
                                            <div style={{ fontWeight: 500 }}>{vms.name || vms.vms}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <TypeBadge>
                                            {vms.vms || vms.type}
                                        </TypeBadge>
                                    </TableCell>
                                    <TableCell>{vms.ip}</TableCell>
                                    <TableCell>{vms.port}</TableCell>
                                    <TableCell>
                                        <StatusBadge $active={vms.active}>
                                            {vms.active ? (
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
                                                onClick={() => handleSyncVms(vms.vms || vms.type)}
                                                disabled={syncStatus.isSync && syncStatus.type === (vms.vms || vms.type)}
                                                icon={<RefreshCw size={14} style={{ animation: syncStatus.isSync && syncStatus.type === (vms.vms || vms.type) ? 'spin 1s linear infinite' : 'none' }} />}
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
                                                variant={vms.active ? "danger" : "success"}
                                                size="small"
                                                onClick={() => handleToggleActive(vms)}
                                                icon={vms.active ? <XCircle size={14} /> : <CheckCircle size={14} />}
                                            >
                                                {vms.active ? "비활성화" : "활성화"}
                                            </Button>
                                        </ActionButtonGroup>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {vmsData.length === 0 && (
                                <tr>
                                    <TableCell colSpan={7}>
                                        <EmptyState>
                                            등록된 VMS가 없습니다.
                                        </EmptyState>
                                    </TableCell>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </TableContainer>
            </Card>

            {/* VMS 추가/수정 모달 */}
            <Modal
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
                    {modalMode === 'add' && (
                        <Select
                            label="VMS 유형"
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            options={vmsTypes.map(type => ({ value: type, label: type }))}
                            placeholder="VMS 유형을 선택하세요"
                            required
                        />
                    )}

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

                    <FormGrid>
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
                    </FormGrid>

                    <CheckboxContainer>
                        <CheckboxInput
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                        />
                        <CheckboxLabel htmlFor="isActive">
                            활성화
                        </CheckboxLabel>
                    </CheckboxContainer>
                </form>
            </Modal>
        </PageContainer>
    );
};

export default VmsList;