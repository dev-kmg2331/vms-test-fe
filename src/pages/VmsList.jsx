import React, { useState, useEffect } from 'react';
import { Card, LoadingState, Alert, Button, Modal, FormField, Select } from '../components/CommonComponents';
import { VmsService } from '../services/ApiService';
import { RefreshCw, Plus, Server, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';

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
            // 현재는 샘플 데이터 사용
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">VMS 관리</h1>
                <div className="flex space-x-2">
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
                </div>
            </div>

            {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

            {syncStatus.message && (
                <Alert
                    type={syncStatus.isSync ? "info" : "success"}
                    message={syncStatus.message}
                    onClose={() => setSyncStatus({ ...syncStatus, message: '' })}
                />
            )}

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    이름
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    유형
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    IP 주소
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    포트
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    상태
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    마지막 업데이트
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    작업
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {vmsData.map((vms) => (
                                <tr key={vms.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Server className="text-gray-500 mr-2" size={16} />
                                            <div className="font-medium">{vms.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {vms.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {vms.ip}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {vms.port}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vms.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                            {vms.isActive ? (
                                                <>
                                                    <CheckCircle size={12} className="mr-1" />
                                                    활성화
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle size={12} className="mr-1" />
                                                    비활성화
                                                </>
                                            )}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(vms.updatedAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <Button
                                            variant="secondary"
                                            size="small"
                                            onClick={() => handleSyncVms(vms.type)}
                                            disabled={syncStatus.isSync && syncStatus.type === vms.type}
                                            icon={<RefreshCw size={14} className={syncStatus.isSync && syncStatus.type === vms.type ? "animate-spin" : ""} />}
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
                                            icon={<Trash2 size={14} />}
                                            className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-300"
                                        >
                                            삭제
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {vmsData.length === 0 && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                        등록된 VMS가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
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
                <form className="space-y-4">
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

                    <div className="grid grid-cols-2 gap-4">
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

                    <div className="flex items-center mt-4">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                            활성화
                        </label>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default VmsList;