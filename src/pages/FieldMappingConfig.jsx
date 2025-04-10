import React, {useEffect, useState} from 'react';
import {Database, Edit, Plus, RefreshCw, RotateCcw, Trash2} from 'lucide-react';
import {FieldMappingService, VmsService} from '../services/ApiService';
import {Alert, Button, Card, FormField, LoadingState, Modal, Select} from '../components/CommonComponents';
import {
    ButtonGroup,
    CodePreview,
    EmptyMessage,
    HeaderContainer,
    PageContainer,
    ParameterItem,
    ParameterLabel,
    ParameterList,
    SectionSubtitle,
    SectionTitle,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeadCell,
    Title,
    ToolbarContainer,
    ToolbarLeft,
    ToolbarRight,
    TypeBadge
} from './styles/FieldMappingStyles';

export const FieldMappingConfig = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vmsTypes, setVmsTypes] = useState([]);
    const [selectedVmsType, setSelectedVmsType] = useState('');
    const [mappingRules, setMappingRules] = useState(null);
    const [fieldAnalysis, setFieldAnalysis] = useState(null);
    const [unifiedFieldAnalysis, setUnifiedFieldAnalysis] = useState(null);
    // 변환 규칙 관련 상태
    const [isTransformModalOpen, setIsTransformModalOpen] = useState(false);
    const [isChannelIdModalOpen, setIsChannelIdModalOpen] = useState(false);
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
        {value: 'DEFAULT_CONVERSION', label: '기본 변환'},
        {value: 'BOOLEAN_CONVERSION', label: '불리언 변환'},
        {value: 'NUMBER_CONVERSION', label: '숫자 변환'},
        {value: 'STRING_FORMAT', label: '문자열 형식'},
        {value: 'DATE_FORMAT', label: '날짜 형식'}
    ];

    // 채널 ID 변환 모달 데이터
    const [channelIdForm, setChannelIdForm] = useState({
        sourceField: ''
    });

    useEffect(() => {
        // 초기 데이터 로드
        async function loadInitialData() {
            await fetchVmsTypes();
            await fetchUnifiedFieldStructure();
        }

        loadInitialData();
    }, []);

    useEffect(() => {
        if (selectedVmsType) {
            fetchMappingRules();
            // VMS 유형이 선택되면 자동으로 필드 구조 분석도 수행
            analyzeFieldStructure();
        }
    }, [selectedVmsType]);

    const fetchVmsTypes = async () => {
        try {
            const typesData = await VmsService.getAllVmsTypes();
            setVmsTypes(typesData);
            // 기본값 선택 제거 - 사용자가 직접 선택하도록 함
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

    const analyzeFieldStructure = async (vmsType = selectedVmsType) => {
        if (!vmsType) return; // VMS 유형이 선택되지 않은 경우 아무것도 하지 않음
        
        setIsLoading(true);

        try {
            const analysisData = await FieldMappingService.analyzeFieldStructure(vmsType);
            setFieldAnalysis(analysisData);
            setSuccessMessage(`${vmsType} VMS의 필드 구조 분석이 완료되었습니다.`);
        } catch (err) {
            console.error(`Failed to analyze field structure for ${vmsType}:`, err);
            setError(`${vmsType} VMS의 필드 구조 분석 중 오류가 발생했습니다.`);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUnifiedFieldStructure = async () => {
        try {
            const analysisData = await FieldMappingService.analyzeUnifiedFieldStructure();
            setUnifiedFieldAnalysis(analysisData);
        } catch (err) {
            console.error("Failed to fetch Unified camera field structure:", err);
            setError("Unified 카메라 필드 구조 분석 중 오류가 발생했습니다.");
        }
    };

    const handleVmsTypeChange = (e) => {
        const newVmsType = e.target.value;
        setSelectedVmsType(newVmsType);
        setFieldAnalysis(null); // 필드 분석 결과 초기화
        
        // 새 VMS 유형이 선택되면 자동으로 필드 구조 분석 시작
        if (newVmsType) {
            analyzeFieldStructure(newVmsType);
        }
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
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleParameterChange = (e) => {
        const {name, value} = e.target;
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
            parameters = {format: '%s'};
        } else if (transformationType === 'DATE_FORMAT') {
            parameters = {sourceFormat: 'yyyy-MM-dd', targetFormat: 'yyyy-MM-dd HH:mm:ss'};
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

    // 채널 ID 모달 관련 함수
    const openChannelIdModal = () => {
        // 기존 채널 ID 설정이 있으면 불러오기
        if (mappingRules && mappingRules.channelIdTransformation) {
            setChannelIdForm({
                sourceField: mappingRules.channelIdTransformation.sourceField
            });
        } else {
            setChannelIdForm({
                sourceField: ''
            });
        }
        setIsChannelIdModalOpen(true);
    };

    const handleChannelIdFormChange = (e) => {
        const { name, value } = e.target;
        setChannelIdForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmitChannelId = async () => {
        try {
            await FieldMappingService.updateChannelIdTransformation(selectedVmsType, channelIdForm);
            setSuccessMessage(`${selectedVmsType} VMS의 채널 ID 변환 규칙이 설정되었습니다.`);
            fetchMappingRules();
            setIsChannelIdModalOpen(false);
        } catch (err) {
            console.error(`Failed to update channel ID transformation for ${selectedVmsType}:`, err);
            setError('채널 ID 변환 규칙 설정 중 오류가 발생했습니다.');
        }
    };

    // 매개변수 필드 렌더링
    const renderParameterFields = () => {
        const {transformationType, parameters} = formData;

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
            const fieldPath = prefix ? `${prefix}-${key}` : key;

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

    // 표준 대상 필드 목록 생성
    const getStandardTargetFields = () => {
        // 기본 표준 필드 목록
        const defaultFields = [
            {value: 'name', label: '이름 (name)'},
            {value: 'channel_ID', label: '채널 ID (channel_ID)'},
            {value: 'channel_name', label: '채널 이름 (channel_name)'},
            {value: 'ip_address', label: 'IP 주소 (ip_address)'},
            {value: 'port', label: '포트 (port)'},
            {value: 'http_port', label: 'HTTP 포트 (http_port)'},
            {value: 'rtsp_url', label: 'RTSP URL (rtsp_url)'},
            {value: 'is_enabled', label: '활성화 여부 (is_enabled)'},
            {value: 'status', label: '상태 (status)'},
            {value: 'supports_PTZ', label: 'PTZ 지원 여부 (supports_PTZ)'},
            {value: 'supports_audio', label: '오디오 지원 여부 (supports_audio)'},
            {value: 'original_id', label: '원본 ID (original_id)'}
        ];

        // Unified 카메라 필드 구조가 있는 경우 추가 필드 생성
        if (unifiedFieldAnalysis && unifiedFieldAnalysis.fields) {
            const unifiedFields = flattenFieldStructure(unifiedFieldAnalysis.fields)
                .map(field => {
                    const existingField = defaultFields.find(df => df.value === field);
                    return {
                        value: field,
                        label: existingField ? existingField.label : `${field} (Unified)`
                    };
                })
                .filter(field => !defaultFields.some(df => df.value === field.value));

            return [...defaultFields, ...unifiedFields];
        }

        return defaultFields;
    };

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
        return <LoadingState message="필드 매핑 정보를 불러오는 중입니다..."/>;
    }

    return (
        <PageContainer>
            <HeaderContainer>
                <Title>필드 매핑 구성</Title>
                <Button
                    variant="outline"
                    onClick={fetchMappingRules}
                    icon={<RefreshCw size={16}/>}
                >
                    새로고침
                </Button>
            </HeaderContainer>

            {error && <Alert type="error" message={error} onClose={() => setError(null)}/>}

            {successMessage && (
                <Alert
                    type="success"
                    message={successMessage}
                    onClose={() => setSuccessMessage('')}
                />
            )}

            <SectionTitle>VMS 유형 선택</SectionTitle>
            <ToolbarContainer>
                <ToolbarLeft>
                    <Select
                        value={selectedVmsType}
                        onChange={handleVmsTypeChange}
                        options={vmsTypes.map(type => ({value: type, label: type}))}
                        placeholder="VMS 유형을 선택하세요"
                    />
                </ToolbarLeft>

                <ToolbarRight>
                    <Button
                        variant="primary"
                        onClick={openAddTransformModal}
                        icon={<Plus size={16}/>}
                    >
                        변환 규칙 추가
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => setIsResetModalOpen(true)}
                        icon={<RotateCcw size={16}/>}
                    >
                        초기화
                    </Button>
                </ToolbarRight>
            </ToolbarContainer>

            {/* 매핑 규칙 목록 */}
            <Card title={`${selectedVmsType} VMS 필드 매핑 규칙`}>
                {mappingRules ? (
                    <>
                        <SectionTitle>채널 ID 변환</SectionTitle>
                        <SectionSubtitle>
                            {mappingRules.channelIdTransformation
                                ? `소스 필드: ${mappingRules.channelIdTransformation.sourceField}`
                                : '채널 ID 변환이 설정되지 않았습니다.'}
                        </SectionSubtitle>
                        <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={() => openChannelIdModal()}
                                icon={<Edit size={14}/>}
                            >
                                채널 ID 변환 설정
                            </Button>
                        </div>

                        <SectionTitle>필드 변환 규칙</SectionTitle>
                        {mappingRules.transformations && mappingRules.transformations.length > 0 ? (
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <tr>
                                            <TableHeadCell>소스 필드</TableHeadCell>
                                            <TableHeadCell>대상 필드</TableHeadCell>
                                            <TableHeadCell>변환 유형</TableHeadCell>
                                            <TableHeadCell>매개변수</TableHeadCell>
                                            <TableHeadCell style={{textAlign: 'right'}}>작업</TableHeadCell>
                                        </tr>
                                    </TableHead>
                                    <TableBody>
                                        {mappingRules.transformations.map((transform, index) => (
                                            <tr key={index}>
                                                <TableCell>{transform.sourceField}</TableCell>
                                                <TableCell>{transform.targetField}</TableCell>
                                                <TableCell>
                                                    <TypeBadge>{transform.transformationType}</TypeBadge>
                                                </TableCell>
                                                <TableCell>
                                                    {transform.parameters && Object.entries(transform.parameters).length > 0 ? (
                                                        <ParameterList>
                                                            {Object.entries(transform.parameters).map(([key, value]) => (
                                                                <ParameterItem key={key}>
                                                                    <ParameterLabel>{key}:</ParameterLabel> {value}
                                                                </ParameterItem>
                                                            ))}
                                                        </ParameterList>
                                                    ) : '-'}
                                                </TableCell>
                                                <TableCell style={{textAlign: 'right'}}>
                                                    <ButtonGroup>
                                                        <Button
                                                            variant="outline"
                                                            size="small"
                                                            onClick={() => openEditTransformModal(transform, index)}
                                                            icon={<Edit size={14}/>}
                                                        >
                                                            수정
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="small"
                                                            onClick={() => handleDeleteTransform(index)}
                                                            icon={<Trash2 size={14}/>}
                                                        >
                                                            삭제
                                                        </Button>
                                                    </ButtonGroup>
                                                </TableCell>
                                            </tr>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <EmptyMessage>등록된 필드 변환 규칙이 없습니다.</EmptyMessage>
                        )}
                    </>
                ) : (
                    <EmptyMessage>매핑 규칙 정보를 불러오는 중입니다...</EmptyMessage>
                )}
            </Card>

            {/* 필드 구조 분석 결과 */}
            {fieldAnalysis && (
                <Card title={`${selectedVmsType} VMS 필드 구조 분석`}>
                    <CodePreview>
                        {JSON.stringify(fieldAnalysis.fields, null, 2)}
                    </CodePreview>
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
                <form>
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
                        options={getStandardTargetFields()}
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
                <p>
                    정말로 <strong>{selectedVmsType}</strong> VMS의 모든 매핑 규칙을 초기화하시겠습니까?
                </p>
                <p style={{marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280'}}>
                    이 작업은 되돌릴 수 없으며, 모든 변환 규칙이 삭제됩니다.
                </p>
            </Modal>

            {/* 채널 ID 변환 설정 모달 */}
            <Modal
                isOpen={isChannelIdModalOpen}
                onClose={() => setIsChannelIdModalOpen(false)}
                title="채널 ID 변환 설정"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsChannelIdModalOpen(false)}>
                            취소
                        </Button>
                        <Button variant="primary" onClick={handleSubmitChannelId}>
                            설정
                        </Button>
                    </>
                }
            >
                <form>
                    <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
                        채널 ID는 카메라를 식별하는 데 사용되는 중요한 필드입니다. 
                        원본 VMS 데이터에서 채널 ID로 사용할 필드를 선택하세요.
                    </p>
                    <Select
                        label="채널 ID 소스 필드"
                        name="sourceField"
                        value={channelIdForm.sourceField}
                        onChange={handleChannelIdFormChange}
                        options={getSourceFieldOptions()}
                        placeholder="채널 ID로 사용할 필드를 선택하세요"
                        required
                    />
                </form>
            </Modal>
        </PageContainer>
    );
};

export default FieldMappingConfig;