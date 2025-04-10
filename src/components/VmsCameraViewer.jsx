import React, {useState, useEffect} from 'react';
import {Database, FileJson, ChevronDown, ChevronUp, RefreshCw} from 'lucide-react';
import {VmsCameraService} from '../services/ApiService';
import {Button, Alert, Select, Card, LoadingState} from '../components/CommonComponents';
import styled from 'styled-components';

const ViewerContainer = styled.div`
    background-color: #ffffff;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ViewerHeader = styled.h2`
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #333;
`;

const ViewerDescription = styled.p`
    margin-bottom: 1rem;
    color: #666;
    font-size: 0.9rem;
`;

const FormContainer = styled.div`
    display: flex;
    gap: 1rem;
    align-items: flex-end;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
    }
`;

const SelectWrapper = styled.div`
    flex: 1;
`;

const TabsContainer = styled.div`
    display: flex;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 1rem;
`;

const Tab = styled.button`
    padding: 0.75rem 1rem;
    background: ${props => props.active ? '#f8fafc' : 'transparent'};
    border: none;
    border-bottom: 2px solid ${props => props.active ? '#3b82f6' : 'transparent'};
    font-weight: ${props => props.active ? '600' : '400'};
    color: ${props => props.active ? '#1e40af' : '#64748b'};
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
        color: #1e40af;
        background: #f1f5f9;
    }
`;

const JsonPreview = styled.pre`
    background-color: #f1f5f9;
    border-radius: 4px;
    padding: 1rem;
    overflow: auto;
    max-height: 400px;
    font-family: monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    margin-top: 1rem;
`;

const ItemCard = styled.div`
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 1rem;
    margin-bottom: 1rem;
    transition: all 0.2s ease;

    &:hover {
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
`;

const ItemHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${props => props.expanded ? '1rem' : '0'};
    cursor: pointer;
`;

const ItemTitle = styled.h3`
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
    color: #334155;
`;

const NoData = styled.p`
    text-align: center;
    color: #64748b;
    padding: 2rem;
    font-style: italic;
`;

/**
 * VMS 카메라 데이터 조회 컴포넌트
 *
 * 이 컴포넌트는 VmsCameraService API를 사용하여
 * VMS 원본 카메라 데이터 및 Raw JSON 데이터를 조회합니다.
 */
const VmsCameraViewer = ({vmsTypes = []}) => {
    const [selectedVmsType, setSelectedVmsType] = useState('');
    const [activeTab, setActiveTab] = useState('cameras'); // 'cameras' or 'rawJson'
    const [cameras, setCameras] = useState([]);
    const [rawJson, setRawJson] = useState([]);
    const [expandedItems, setExpandedItems] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedVmsType) {
            loadData();
        }
    }, [selectedVmsType, activeTab]);

    const handleVmsTypeChange = (e) => {
        setSelectedVmsType(e.target.value);
        setExpandedItems({});
    };

    const loadData = async () => {
        if (!selectedVmsType) return;

        setIsLoading(true);
        setError(null);

        try {
            if (activeTab === 'cameras') {
                const data = await VmsCameraService.getCamerasByVmsType(selectedVmsType);
                setCameras(data);
            } else {
                const data = await VmsCameraService.getRawJsonByVmsType(selectedVmsType);
                setRawJson(data);
            }
        } catch (err) {
            console.error(`Failed to fetch ${activeTab} for VMS ${selectedVmsType}:`, err);
            setError(`${activeTab === 'cameras' ? '카메라' : '원본 JSON'} 데이터를 불러오는 중 오류가 발생했습니다.`);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleItem = (id) => {
        setExpandedItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const renderCameras = () => {
        if (cameras.length === 0) {
            return <NoData>데이터가 없습니다.</NoData>;
        }

        return cameras.map((camera, index) => (
            <ItemCard key={camera._id || index}>
                <ItemHeader expanded={expandedItems[camera._id || index]}
                            onClick={() => toggleItem(camera._id || index)}>
                    <ItemTitle>{camera.name || camera.Name || camera.cameraName || `카메라 ${index + 1}`}</ItemTitle>
                    {expandedItems[camera._id || index] ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                </ItemHeader>

                {expandedItems[camera._id || index] && (
                    <JsonPreview>{JSON.stringify(camera, null, 2)}</JsonPreview>
                )}
            </ItemCard>
        ));
    };

    const renderRawJson = () => {
        if (rawJson.length === 0) {
            return <NoData>데이터가 없습니다.</NoData>;
        }

        return (
            <ItemCard key={rawJson._id}>
                <ItemHeader expanded={expandedItems[rawJson._id]} onClick={() => toggleItem(rawJson._id)}>
                    <ItemTitle>원본 데이터</ItemTitle>
                    {expandedItems[rawJson._id] ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                </ItemHeader>

                {expandedItems[rawJson._id] && (
                    <JsonPreview>{JSON.stringify(rawJson, null, 2)}</JsonPreview>
                )}
            </ItemCard>
        )
    };

    return (
        <ViewerContainer>
            <ViewerHeader>VMS 카메라 데이터 조회</ViewerHeader>
            <ViewerDescription>
                VMS 시스템의 원본 카메라 데이터와 Raw JSON 데이터를 조회합니다.
            </ViewerDescription>

            {error && (
                <Alert
                    type="error"
                    message={error}
                    onClose={() => setError(null)}
                />
            )}

            <FormContainer>
                <SelectWrapper>
                    <Select
                        label="VMS 유형"
                        value={selectedVmsType}
                        onChange={handleVmsTypeChange}
                        options={vmsTypes.map(type => ({value: type, label: type}))}
                        placeholder="VMS 유형을 선택하세요"
                    />
                </SelectWrapper>
                <Button
                    variant="outline"
                    onClick={loadData}
                    disabled={isLoading || !selectedVmsType}
                    icon={<RefreshCw size={16} style={{animation: isLoading ? 'spin 1s linear infinite' : 'none'}}/>}
                >
                    새로고침
                </Button>
            </FormContainer>

            <TabsContainer>
                <Tab
                    active={activeTab === 'cameras'}
                    onClick={() => setActiveTab('cameras')}
                >
                    <Database size={16}/>
                    카메라 데이터
                </Tab>
                <Tab
                    active={activeTab === 'rawJson'}
                    onClick={() => setActiveTab('rawJson')}
                >
                    <FileJson size={16}/>
                    원본 JSON 데이터
                </Tab>
            </TabsContainer>

            {isLoading ? (
                <LoadingState message={`${activeTab === 'cameras' ? '카메라' : '원본 JSON'} 데이터를 불러오는 중...`}/>
            ) : (
                <Card>
                    {activeTab === 'cameras' ? renderCameras() : renderRawJson()}
                </Card>
            )}
        </ViewerContainer>
    );
};

export default VmsCameraViewer;
