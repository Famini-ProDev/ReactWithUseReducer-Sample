import { Types } from "./constant"

const defineReducer = () => {
    interface initState {
        loadingSaveButton: boolean,
        loadingPage: boolean,
        examTypesDataSource: SimpleItemViewModel[],
        interviewTypesDataSource: SimpleItemViewModel[]
        initialData: RecruitmentPhaseItemViewModel
        newCode: number
        basePostValues: SimpleItemViewModel[],
        factorTypesDataSource: RecruitmentPhaseFactorTypeViewModel[]
    }
    type actionTypes = { type: Types.setLoadingSaveButton, loadingSaveButton: boolean }
        | { type: Types.setLoadingPage, loadingPage: boolean }
        | { type: Types.setExamTypesDataSource, examTypesDataSource: SimpleItemViewModel[] }
        | { type: Types.setInterviewTypesDataSource, interviewTypesDataSource: SimpleItemViewModel[] }
        | { type: Types.setNewCode, newCode: number }
        | { type: Types.setInitialData, initialData: RecruitmentPhaseItemViewModel }
        | { type: Types.setBasePostGroupValues, basePostValues: SimpleItemViewModel[] }
        | { type: Types.setFactorTypesDataSource, factorTypesDataSource: RecruitmentPhaseFactorTypeViewModel[] }

    const initialState: initState = {
        loadingSaveButton: false,
        loadingPage: true,
        examTypesDataSource: undefined,
        interviewTypesDataSource: undefined,
        newCode: null,
        basePostValues: [],
        factorTypesDataSource: [],
        initialData: {
            Guid: '',
            Code: null,
            Title: '',
            IsActive: true,
            Id: null,
            BasePostGroupGuid: null,
            RecruitmentPhaseDetail: [],
            OperationalUnit: [],
            IsDefault: true,
            GuidBasePostGroup: ''
        }
    }
    const reducer = (state: initState, action: actionTypes): initState => {
        switch (action.type) {
            case Types.setLoadingSaveButton:
                return {
                    ...state,
                    loadingSaveButton: action.loadingSaveButton
                }

            case Types.setLoadingPage:
                return {
                    ...state,
                    loadingPage: action.loadingPage
                }
            case Types.setNewCode:
                return {
                    ...state,
                    newCode: action.newCode
                }
            case Types.setExamTypesDataSource:
                return {
                    ...state,
                    examTypesDataSource: action.examTypesDataSource
                }
            case Types.setInterviewTypesDataSource:
                return {
                    ...state,
                    interviewTypesDataSource: action.interviewTypesDataSource
                }
            case Types.setBasePostGroupValues:
                return {
                    ...state,
                    basePostValues: action.basePostValues
                }
            case Types.setInitialData:
                return {
                    ...state,
                    initialData: action.initialData
                }
            case Types.setFactorTypesDataSource:
                return {
                    ...state,
                    factorTypesDataSource: action.factorTypesDataSource
                }
            default:
                return initialState
        }
    }
    return {
        initialState,
        reducer
    }
}

export default defineReducer 