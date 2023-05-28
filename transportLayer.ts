import { getApiUrl } from 'Utility/helper';
import { useAjax } from 'components'

export function useRecruitmentPhaseApi() {

    const ajax: _Ajax.AjaxContext = useAjax();

    const getListApi = getApiUrl('BasicInformation', 'RecruitmentPhase', 'Search')
    const saveApi = getApiUrl('BasicInformation', 'RecruitmentPhase', 'Save');
    const toggleActivationApi = getApiUrl('BasicInformation', 'RecruitmentPhase', 'ToggleActivation')
    const defaultActivationApi = getApiUrl('BasicInformation', 'RecruitmentPhase', 'IsDefaultActivation')
    const existsIsDefaultApi = getApiUrl('BasicInformation', 'RecruitmentPhase', 'ExistsIsDefault')
    const deleteRecordApi = getApiUrl('BasicInformation', 'RecruitmentPhase', 'Delete');
    const getBasePostGroupApi = getApiUrl('BasicInformation', 'RecruitmentPhase', 'InitGetBasePostGroup')
    const getLatestCodeApi = getApiUrl('BasicInformation', 'RecruitmentPhase', 'GetLatestCode');
    const getApi = getApiUrl('BasicInformation', 'RecruitmentPhase', 'Get')
    const getAccessPermissionsApi = getApiUrl('BasicInformation', 'RecruitmentPhase', 'GetAccessPermissions')
    const getExamTypesApi = getApiUrl('Common', 'RecruitmentCommon', 'GetExamTypes')
    const getInterviewTypesApi = getApiUrl('Common', 'RecruitmentCommon', 'GetInterviewTypes')
    const getRecruitmentPhaseFactorTypeApi = getApiUrl('Common', 'RecruitmentCommon', 'GetRecruitmentPhaseFactorType')

    return {
        getListApi,
        toggleActivation: (record: BasicInformationViewModel) => ajax.post(toggleActivationApi, record),
        defaultActivation: (recordGuid: IsDefaultActivationViewModel) => ajax.post(defaultActivationApi, recordGuid),
        save: (data: RecruitmentPhaseSaveViewModel) => ajax.post(saveApi, data),
        deleteRecord: (guid: string) => ajax.post(deleteRecordApi, guid),
        getBasePostGroup: (selectedRecordGuid: string) => ajax.post(getBasePostGroupApi, selectedRecordGuid),
        getRecruitmentPhaseFactorType: () => ajax.post(getRecruitmentPhaseFactorTypeApi, {}),
        get: (guid: string) => ajax.post(getApi, guid),
        getLatestCode: () => ajax.post(getLatestCodeApi, {}),
        getExamTypes: () => ajax.post(getExamTypesApi, {}),
        getInterviewTypes: () => ajax.post(getInterviewTypesApi, {}),
        getAccessPermissions: () => ajax.post(getAccessPermissionsApi, {}),
        existsIsDefault: () => ajax.post(existsIsDefaultApi, {})

    }
}