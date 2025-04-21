import React from 'react';

// API 기본 URL
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * API 호출 기본 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {Object} options - fetch 옵션
 * @returns {Promise} - API 응답 Promise
 */
const fetchAPI = async (endpoint, options = {}) => {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...defaultOptions,
        ...options,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({
            message: '알 수 없는 오류가 발생했습니다.',
        }));
        throw new Error(errorData.message || `API 호출 실패: ${response.statusText}`);
    }

    return await response.json();
};

/**
 * VMS 관련 API 서비스
 */
export const VmsService = {
    /**
     * 지원되는 모든 VMS 유형 조회
     */
    getAllVmsTypes: async () => {
        try {
            const response = await fetchAPI('/v2/vms/types');
            return response.rows || [];
        } catch (error) {
            console.error('Failed to fetch VMS types:', error);
            throw error;
        }
    },

    /**
     * 모든 VMS 설정 조회
     */
    getAllVmsConfigs: async () => {
        try {
            const response = await fetchAPI('/v2/vms/configs');
            return response;
        } catch (error) {
            console.error('Failed to fetch VMS configs:', error);
            throw error;
        }
    },

    /**
     * 특정 VMS 설정 조회
     * @param {string} vmsType - VMS 유형
     */
    getVmsConfig: async (vmsType) => {
        try {
            const response = await fetchAPI(`/v2/vms/config/${vmsType}`);
            return response;
        } catch (error) {
            console.error(`Failed to fetch config for VMS ${vmsType}:`, error);
            throw error;
        }
    },

    /**
     * VMS 설정 업데이트
     * @param {string} vmsType - VMS 유형
     * @param {Object} configData - 업데이트할 설정 데이터
     */
    updateVmsConfig: async (vmsType, configData) => {
        try {
            const response = await fetchAPI(`/v2/vms/config/${vmsType}`, {
                method: 'POST',
                body: JSON.stringify(configData)
            });
            return response;
        } catch (error) {
            console.error(`Failed to update config for VMS ${vmsType}:`, error);
            throw error;
        }
    },

    /**
     * VMS 활성화 상태 변경
     * @param {string} vmsType - VMS 유형
     * @param {boolean} active - 활성화 여부
     */
    setVmsConfigActive: async (vmsType, active) => {
        try {
            const response = await fetchAPI(`/v2/vms/config/${vmsType}/active?active=${active}`, {
                method: 'PUT'
            });
            return response;
        } catch (error) {
            console.error(`Failed to set active status for VMS ${vmsType}:`, error);
            throw error;
        }
    },

    /**
     * 특정 VMS 동기화
     * @param {string} vmsType - VMS 유형
     */
    synchronizeVms: async (vmsType) => {
        try {
            const response = await fetchAPI(`/v2/vms/sync/${vmsType}`, {
                method: 'POST',
            });
            return response;
        } catch (error) {
            console.error(`Failed to synchronize VMS ${vmsType}:`, error);
            throw error;
        }
    },

    /**
     * 모든 VMS 동기화
     */
    synchronizeAllVms: async () => {
        try {
            const response = await fetchAPI('/v2/vms/sync', {
                method: 'POST',
            });
            return response;
        } catch (error) {
            console.error('Failed to synchronize all VMS:', error);
            throw error;
        }
    },
};

/**
 * 카메라 관련 API 서비스
 */
export const CameraService = {
    /**
     * 모든 통합 카메라 조회
     */
    getAllCameras: async () => {
        try {
            const response = await fetchAPI('/v2/vms/unified/cameras');
            return response.rows || [];
        } catch (error) {
            console.error('Failed to fetch cameras:', error);
            throw error;
        }
    },

    /**
     * VMS 유형별 카메라 조회
     * @param {string} vmsType - VMS 유형
     */
    getCamerasByVmsType: async (vmsType) => {
        try {
            const response = await fetchAPI(`/v2/vms/unified/cameras/type/${vmsType}`);
            return response.rows || [];
        } catch (error) {
            console.error(`Failed to fetch cameras for VMS ${vmsType}:`, error);
            throw error;
        }
    },

    /**
     * VMS 카메라 동기화
     * @param {string} vmsType - VMS 유형
     */
    synchronizeCameras: async (vmsType) => {
        try {
            const response = await fetchAPI(`/v2/vms/unified/cameras/sync/${vmsType}`, {
                method: 'POST',
            });
            return response;
        } catch (error) {
            console.error(`Failed to synchronize cameras for VMS ${vmsType}:`, error);
            throw error;
        }
    },
};

/**
 * VMS 원본 카메라 관련 API 서비스
 */
export const VmsCameraService = {
    /**
     * 모든 VMS 카메라 조회
     */
    getAllCameras: async () => {
        try {
            const response = await fetchAPI('/v2/vms/cameras');
            return response.rows || [];
        } catch (error) {
            console.error('Failed to fetch VMS cameras:', error);
            throw error;
        }
    },

    /**
     * VMS 유형별 카메라 조회
     * @param {string} vmsType - VMS 유형
     */
    getCamerasByVmsType: async (vmsType) => {
        try {
            const response = await fetchAPI(`/v2/vms/cameras/type/${vmsType}`);
            return response.rows || [];
        } catch (error) {
            console.error(`Failed to fetch cameras for VMS ${vmsType}:`, error);
            throw error;
        }
    },

    /**
     * 카메라 ID로 조회
     * @param {string} cameraId - 카메라 ID
     */
    getCameraById: async (cameraId) => {
        try {
            const response = await fetchAPI(`/v2/vms/cameras/${cameraId}`);
            return response.rows || null;
        } catch (error) {
            console.error(`Failed to fetch camera with ID ${cameraId}:`, error);
            throw error;
        }
    },

    /**
     * 모든 원본 JSON 조회
     */
    getAllRawJson: async () => {
        try {
            const response = await fetchAPI('/v2/vms/cameras/raw');
            return response.rows || [];
        } catch (error) {
            console.error('Failed to fetch all raw JSON data:', error);
            throw error;
        }
    },

    /**
     * VMS 유형별 원본 JSON 조회
     * @param {string} vmsType - VMS 유형
     */
    getRawJsonByVmsType: async (vmsType) => {
        try {
            const response = await fetchAPI(`/v2/vms/cameras/raw/type/${vmsType}`);
            return response.rows || [];
        } catch (error) {
            console.error(`Failed to fetch raw JSON for VMS ${vmsType}:`, error);
            throw error;
        }
    },

    /**
     * ID로 원본 JSON 조회
     * @param {string} documentId - 문서 ID
     */
    getRawJsonById: async (documentId) => {
        try {
            const response = await fetchAPI(`/v2/vms/cameras/raw/${documentId}`);
            return response.rows || null;
        } catch (error) {
            console.error(`Failed to fetch raw JSON with ID ${documentId}:`, error);
            throw error;
        }
    }
};

/**
 * 필드 매핑 관련 API 서비스
 */
export const FieldMappingService = {
    /**
     * 모든 매핑 규칙 조회
     */
    getAllMappingRules: async () => {
        try {
            const response = await fetchAPI('/v2/vms/mappings');
            return response.rows || [];
        } catch (error) {
            console.error('Failed to fetch mapping rules:', error);
            throw error;
        }
    },

    /**
     * VMS 유형별 매핑 규칙 조회
     * @param {string} vmsType - VMS 유형
     */
    getMappingRulesByType: async (vmsType) => {
        try {
            const response = await fetchAPI(`/v2/vms/mappings/${vmsType}`);
            return response.rows || {};
        } catch (error) {
            console.error(`Failed to fetch mapping rules for VMS ${vmsType}:`, error);
            throw error;
        }
    },

    /**
     * 필드 변환 규칙 추가
     * @param {string} vmsType - VMS 유형
     * @param {Object} transformationData - 변환 규칙 데이터
     */
    addTransformation: async (vmsType, transformationData) => {
        try {
            const response = await fetchAPI(`/v2/vms/mappings/${vmsType}/transformation`, {
                method: 'POST',
                body: JSON.stringify(transformationData),
            });
            return response;
        } catch (error) {
            console.error(`Failed to add transformation for VMS ${vmsType}:`, error);
            throw error;
        }
    },

    /**
     * 채널 ID 변환 규칙 추가/변경
     * @param {string} vmsType - VMS 유형
     * @param {Object} transformationData - 변환 규칙 데이터 (소스 필드만 필요)
     */
    updateChannelIdTransformation: async (vmsType, transformationData) => {
        try {
            const response = await fetchAPI(`/v2/vms/mappings/${vmsType}/id-transformation`, {
                method: 'POST',
                body: JSON.stringify(transformationData),
            });
            return response;
        } catch (error) {
            console.error(`Failed to update channel ID transformation for VMS ${vmsType}:`, error);
            throw error;
        }
    },

    /**
     * 필드 변환 규칙 삭제
     * @param {string} vmsType - VMS 유형
     * @param {number} index - 삭제할 변환 규칙 인덱스
     */
    removeTransformation: async (vmsType, index) => {
        try {
            const response = await fetchAPI(`/v2/vms/mappings/${vmsType}/transformation/${index}`, {
                method: 'DELETE',
            });
            return response;
        } catch (error) {
            console.error(`Failed to remove transformation at index ${index} for VMS ${vmsType}:`, error);
            throw error;
        }
    },

    /**
     * 매핑 규칙 초기화
     * @param {string} vmsType - VMS 유형
     */
    resetMappingRules: async (vmsType) => {
        try {
            const response = await fetchAPI(`/v2/vms/mappings/${vmsType}/reset`, {
                method: 'POST',
            });
            return response;
        } catch (error) {
            console.error(`Failed to reset mapping rules for VMS ${vmsType}:`, error);
            throw error;
        }
    },

    /**
     * VMS 필드 구조 분석
     * @param {string} vmsType - VMS 유형
     */
    analyzeFieldStructure: async (vmsType) => {
        try {
            const response = await fetchAPI(`/v2/vms/mappings/analyze/${vmsType}`);
            return response.rows || {};
        } catch (error) {
            console.error(`Failed to analyze field structure for VMS ${vmsType}:`, error);
            throw error;
        }
    },
    
    /**
     * Unified 카메라 필드 구조 분석
     */
    analyzeUnifiedFieldStructure: async () => {
        try {
            const response = await fetchAPI('/v2/vms/mappings/analyze');
            return response.rows || {};
        } catch (error) {
            console.error('Failed to analyze Unified camera field structure:', error);
            throw error;
        }
    },
};

// API 서비스 컴포넌트 (예시용)
const ApiService = () => {
    return null;
};

export default ApiService;