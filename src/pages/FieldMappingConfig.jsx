import React, { useState, useEffect } from 'react';
import { Card, LoadingState, Alert, Button, Modal, Select, FormField } from '../components/CommonComponents';
import { FieldMappingService, VmsService } from '../services/ApiService';
import { RefreshCw, Plus, Edit, Trash2, Save, RotateCcw, Database } from 'lucide-react';

export const FieldMappingConfig = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vmsTypes, setVmsTypes] = useState([]);
    const [selectedVmsType, setSelectedVmsType] = useState('');
    const [mappingRules, setMappingRules] = useState(null);
    const [fieldAnalysis, setFieldAnalysis] = useState(null);

    // 변환 규칙 관련 상태
    const [isTransformModalOpen, setIsTransformModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' 또는 'edit'
    const [currentTransformIndex, setCurrentTransformIndex] = useState(null);

    // 초기화 모달
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    // 성공 메시지
    const [successMessage, setSuccessMessage] = useState('');

    // 폼 데이터
    const [formData, setFormData] = useState({
        sourceField: '',
        targetField: '',
        transformationType: '',
        parameters: {}
    });

    // 변환 유형 목록
    const transformationTypes = [
        { value: 'DEFAULT_CONVERSION', label: '기본 변환' },
        { value: 'BOOLEAN_CONVERSION', label: '불리언 변환' },
        { value: 'NUMBER_CONVERSION', label: '숫자 변환' },
        { value: 'STRING_FORMAT', label: '문자열 형식' },
        { value: 'DATE_FORMAT', label: '날짜 형식' }
    ];

    useEffect(() => {
        fetchVmsTypes();
    }, []);

    useEffect(() => {
        if (selectedVmsType) {
            fetchMappingRules();
        }
    }, [selectedVmsType]);

    const fetchVmsTypes = async () => {
        try {
            const typesData = await VmsService.getAllVmsTypes();
            setVmsTypes(typesData);

            if (typesData && typesData.length > 0) {
                setSelectedVmsType(typesData[0]);
            }
        } catch (err) {
            console.error('Failed to fetch VMS types:', err);
            setError('VMS 유형 정보를 가져오는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMappingRules = async () => {
        setIsLoading(true);

        try {
            const rulesData = await FieldMappingService.getMappingRulesByType(selectedVmsType);
            setMappingRules(rulesData);
        } catch (err) {
            console.error(`Failed to fetch mapping rules for ${selectedVmsType}:`, err);
            setError(`${selectedVmsType} VMS의 매핑 규칙을 가져오는 중 오류가 발생했습니다.`);
        } finally {
            setIsLoading(false);
        }
    };

    const analyzeFieldStructure = async () => {
        setIsLoading(true);

        try {
            const analysisData = await FieldMappingService.analyzeFieldStructure(selectedVmsType);
            setFieldAnalysis(analysisData);
            setSuccessMessage(`${selectedVmsType} VMS의 필드 구조 분석이 완료되었습니다.`);
        } catch (err) {
            console.error(`Failed to analyze field structure for ${selectedVmsType}:`, err);
            setError(`${selectedVmsType} VMS의 필드 구조 분석 중 오류가 발생했습니다.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVmsTypeChange = (e) => {
        setSelectedVmsType(e.target.value);
        setFieldAnalysis(null);
    };

    const openAddTransformModal = () => {
        setModalMode('add');
        setFormData({
            sourceField: '',
            targetField: '',
            transformationType: 'DEFAULT_CONVERSION',
            parameters: {}
        });
        setIsTransformModalOpen(true);
    };

    const openEditTransformModal = (transformation, index) => {
        setModalMode('edit');
        setCurrentTransformIndex(index);
        setFormData({
            sourceField: transformation.sourceField || '',
            targetField: transformation.targetField || '',
            transformationType: transformation.transformationType || 'DEFAULT_CONVERSION',
            parameters: transformation.parameters || {}
        });
        setIsTransformModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleParameterChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            parameters: {
                ...prev.parameters,
                [name]: value
            }
        }));
    };

    const handleTransformTypeChange = (e) => {
        const transformationType = e.target.value;
        let parameters = {};

        // 변환 유형에 따라 기본 매개변수 설정
        if (transformationType === 'STRING_FORMAT') {
            parameters = { format: '%s' };
        } else if (transformationType === 'DATE_FORMAT') {
            parameters = { sourceFormat: 'yyyy-MM-dd', targetFormat: 'yyyy-MM-dd HH:mm:ss' };
        }

        setFormData(prev => ({
            ...prev,
            transformationType,
            parameters
        }));
    };

    const handleSubmitTransform = async () => {
        try {
            if (modalMode === 'add') {
                await FieldMappingService.addTransformation(selectedVmsType, formData);
                setSuccessMessage(`${selectedVmsType} VMS에 새 변환 규칙이 추가되었습니다.`);
            } else {
                // API에는 수정 엔드포인트가 없으므로, 삭제 후 추가로 처리
                await FieldMappingService.removeTransformation(selectedVmsType, currentTransformIndex);
                await FieldMappingService.addTransformation(selectedVmsType, formData);
                setSuccessMessage(`${selectedVmsType} VMS의 변환 규칙이 수정되었습니다.`);
            }

            fetchMappingRules();
            setIsTransformModalOpen(false);
        } catch (err) {
            console.error(`Failed to ${modalMode === 'add' ? 'add' : 'edit'} transformation:`, err);
            setError(`변환 규칙 ${modalMode === 'add' ? '추가' : '수정'} 중 오류가 발생했습니다.`);
        }
    };

    const handleDeleteTransform = async (index) => {
        if (!window.confirm('정말로 이 변환 규칙을 삭제하시겠습니까?')) {
            return;
        }

        try {
            await FieldMappingService.removeTransformation(selectedVmsType, index);
            setSuccessMessage(`${selectedVmsType} VMS의 변환 규칙이 삭제되었습니다.`);
            fetchMappingRules();
        } catch (err) {
            console.error(`Failed to delete transformation at index ${index}:`, err);
            setError('변환 규칙 삭제 중 오류가 발생했습니다.');
        }
    };

    const handleResetMappingRules = async () => {
        try {
            await FieldMappingService.resetMappingRules(selectedVmsType);
            setSuccessMessage(`${selectedVmsType} VMS의 매핑 규칙이 초기화되었습니다.`);
            fetchMappingRules();
            setIsResetModalOpen(false);
        } catch (err) {
            console.error(`Failed to reset mapping rules for ${selectedVmsType}:`, err);
            setError('매핑 규칙 초기화 중 오류가 발생했습니다.');
        }
    };

    // 매개변수 필드 렌더링
    const renderParameterFields = () => {
        const { transformationType, parameters } = formData;

        switch (transformationType) {
            case 'STRING_FORMAT':
                return (
                    <FormField
                        label="문자열 형식 (%s는 원본 값으로 대체됨)"
                        name="format"
                        value={parameters.format || '%s'}
                        onChange={handleParameterChange}
                        placeholder="%s"
                    />
                );
            case 'DATE_FORMAT':
                return (
                    <>
                        <FormField
                            label="원본 날짜 형식"
                            name="sourceFormat"
                            value={parameters.sourceFormat || 'yyyy-MM-dd'}
                            onChange={handleParameterChange}
                            placeholder="yyyy-MM-dd"
                        />
                        <FormField
                            label="대상 날짜 형식"
                            name="targetFormat"
                            value={parameters.targetFormat || 'yyyy-MM-dd HH:mm:ss'}
                            onChange={handleParameterChange}
                            placeholder="yyyy-MM-dd HH:mm:ss"
                        />
                    </>
                );
            default:
                return null;
        }
    };

    // 필드 구조 객체를 평면화하여 소스 필드 목록 생성
    const flattenFieldStructure = (obj, prefix = '') => {
        let result = [];

        if (!obj) return result;

        Object.entries(obj).forEach(([key, value]) => {
            const fieldPath = prefix ? `${prefix}.${key}` : key;

            if (typeof value === 'object' && value !== null) {
                // 객체인 경우 재귀 호출
                if (Array.isArray(value)) {
                    // 배열인 경우 첫 요소만 처리
                    if (value.length > 0 && typeof value[0] === 'object') {
                        result = [...result, ...flattenFieldStructure(value[0], `${fieldPath}[0]`)];
                    } else {
                        result.push(fieldPath);
                    }
                } else {
                    result = [...result, ...flattenFieldStructure(value, fieldPath)];
                }
            } else {
                // 기본 타입인 경우 경로 추가
                result.push(fieldPath);
            }
        });

        return result;
    };

    // 표준 대상 필드 목록
    const standardTargetFields = [
        { value: 'name', label: '이름 (name)' },
        { value: 'channel_ID', label: '채널 ID (channel_ID)' },
        { value: 'channel_name', label: '채널 이름 (channel_name)' },
        { value: 'ip_address', label: 'IP 주소 (ip_address)' },
        { value: 'port', label: '포트 (port)' },
        { value: 'http_port', label: 'HTTP 포트 (http_port)' },
        { value: 'rtsp_url', label: 'RTSP URL (rtsp_url)' },
        { value: 'is_enabled', label: '활성화 여부 (is_enabled)' },
        { value: 'status', label: '상태 (status)' },
        { value: 'supports_PTZ', label: 'PTZ 지원 여부 (supports_PTZ)' },
        { value: 'supports_audio', label: '오디오 지원 여부 (supports_audio)' },
        { value: 'original_id', label: '원본 ID (original_id)' }
    ];

    // 소스 필드 옵션 생성
    const getSourceFieldOptions = () => {
        if (!fieldAnalysis || !fieldAnalysis.fields) {
            return [];
        }

        // 필드 구조 평면화
        const flattenedFields = flattenFieldStructure(fieldAnalysis.fields);

        // 옵션 형식으로 변환
        return flattenedFields.map(field => ({
            value: field,
            label: field
        }));
    };

    if (isLoading) {
        return <LoadingState message="필드 매핑 정보를 불러오는 중입니다..." />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">필드 매핑 구성</h1>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={fetchMappingRules}
                        icon={<RefreshCw size={16} />}
                    >
                        새로고침
                    </Button>
                </div>
            </div>

            {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

            {successMessage && (
                <Alert
                    type="success"
                    message={successMessage}
                    onClose={() => setSuccessMessage('')}
                />
            )}

            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex-grow mr-4">
                    <Select
                        label="VMS 유형"
                        value={selectedVmsType}
                        onChange={handleVmsTypeChange}
                        options={vmsTypes.map(type => ({ value: type, label: type }))}
                        placeholder="VMS 유형을 선택하세요"
                    />
                </div>

                <div className="flex space-x-2">
                    <Button
                        variant="secondary"
                        onClick={analyzeFieldStructure}
                        icon={<Database size={16} />}
                    >
                        필드 구조 분석
                    </Button>
                    <Button
                        variant="primary"
                        onClick={openAddTransformModal}
                        icon={<Plus size={16} />}
                    >
                        변환 규칙 추가
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => setIsResetModalOpen(true)}
                        icon={<RotateCcw size={16} />}
                    >
                        초기화
                    </Button>
                </div>
            </div>

            {/* 매핑 규칙 목록 */}
            <Card title={`${selectedVmsType} VMS 필드 매핑 규칙`}>
                {mappingRules ? (
                    <>
                        <div className="mb-4">
                            <h3 className="text-lg font-medium">채널 ID 변환</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {mappingRules.channelIdTransformation
                                    ? `소스 필드: ${mappingRules.channelIdTransformation.sourceField}`
                                    : '채널 ID 변환이 설정되지 않았습니다.'}
                            </p>
                        </div>

                        <h3 className="text-lg font-medium mb-2">필드 변환 규칙</h3>
                        {mappingRules.transformations && mappingRules.transformations.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-800">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                소스 필드
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                대상 필드
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                변환 유형
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                매개변수
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                작업
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {mappingRules.transformations.map((transform, index) => (
                                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {transform.sourceField}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {transform.targetField}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                        {transform.transformationType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {transform.parameters && Object.entries(transform.parameters).map(([key, value]) => (
                                                        <div key={key} className="text-sm">
                                                            <span className="font-medium">{key}:</span> {value}
                                                        </div>
                                                    ))}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="small"
                                                        onClick={() => openEditTransformModal(transform, index)}
                                                        icon={<Edit size={14} />}
                                                    >
                                                        수정
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="small"
                                                        onClick={() => handleDeleteTransform(index)}
                                                        icon={<Trash2 size={14} />}
                                                    >
                                                        삭제
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {mappingRules.transformations.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                    등록된 필드 변환 규칙이 없습니다.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 py-4 text-center">
                                등록된 필드 변환 규칙이 없습니다.
                            </p>
                        )}
                    </>
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 py-4 text-center">
                        매핑 규칙 정보를 불러오는 중입니다...
                    </p>
                )}
            </Card>

            {/* 필드 구조 분석 결과 */}
            {fieldAnalysis && (
                <Card title={`${selectedVmsType} VMS 필드 구조 분석`}>
                    <div className="overflow-x-auto">
                        <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto max-h-96">
                            {JSON.stringify(fieldAnalysis.fields, null, 2)}
                        </pre>
                    </div>
                </Card>
            )}

            {/* 변환 규칙 추가/수정 모달 */}
            <Modal
                isOpen={isTransformModalOpen}
                onClose={() => setIsTransformModalOpen(false)}
                title={modalMode === 'add' ? '변환 규칙 추가' : '변환 규칙 수정'}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsTransformModalOpen(false)}>
                            취소
                        </Button>
                        <Button variant="primary" onClick={handleSubmitTransform}>
                            {modalMode === 'add' ? '추가' : '수정'}
                        </Button>
                    </>
                }
            >
                <form className="space-y-4">
                    <Select
                        label="소스 필드"
                        name="sourceField"
                        value={formData.sourceField}
                        onChange={handleInputChange}
                        options={getSourceFieldOptions()}
                        placeholder="소스 필드를 선택하세요"
                        required
                    />

                    <Select
                        label="대상 필드"
                        name="targetField"
                        value={formData.targetField}
                        onChange={handleInputChange}
                        options={standardTargetFields}
                        placeholder="대상 필드를 선택하세요"
                        required
                    />

                    <Select
                        label="변환 유형"
                        name="transformationType"
                        value={formData.transformationType}
                        onChange={handleTransformTypeChange}
                        options={transformationTypes}
                        placeholder="변환 유형을 선택하세요"
                        required
                    />

                    {/* 변환 유형에 따른 추가 매개변수 */}
                    {renderParameterFields()}
                </form>
            </Modal>

            {/* 초기화 확인 모달 */}
            <Modal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                title="매핑 규칙 초기화"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsResetModalOpen(false)}>
                            취소
                        </Button>
                        <Button variant="danger" onClick={handleResetMappingRules}>
                            초기화
                        </Button>
                    </>
                }
            >
                <p className="text-gray-700 dark:text-gray-300">
                    정말로 <strong>{selectedVmsType}</strong> VMS의 모든 매핑 규칙을 초기화하시겠습니까?
                </p>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                    이 작업은 되돌릴 수 없으며, 모든 변환 규칙이 삭제됩니다.
                </p>
            </Modal>
        </div>
    );
};

export default FieldMappingConfig;