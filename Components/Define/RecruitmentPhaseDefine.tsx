
import * as React from 'react'
import { FormLayout, WrappedFormUtils, Button, Modal, Message, Form, FormComponentProps, useCommandHandler, TokenContainer, ButtonSet, Command, MultiSelectList, Spin, MultiSelectListRemoteDataSource, FieldRule, Alert } from 'didgah/components';
import { TableExEditStore, TableExViewStore } from 'components/providers'
import { checkUniqenessCulomnTable, Language } from "Utility/helper";
import { useRecruitmentPhaseApi } from '../../transportLayer'
import RecruitmentFactorList from './RecruitmentFactorList';
import defineReducer from '../../Reducer/defineReducer';
import { Types } from "../../Reducer/constant"
import RecruitmentFactorPanel from './RecruitmentFactorPanel';

interface RecruitmentPhaseDefineProps extends FormComponentProps {
    type: SaveType
    record: BasicInformationViewModel
    tableStore: TableExViewStore<BasicInformationViewModel, string>
    accessDefine: boolean
}
function RecruitmentPhaseDefine({ tableStore, type, record, accessDefine }: RecruitmentPhaseDefineProps) {
    const { reducer, initialState } = defineReducer()
    const [state, dispatch] = React.useReducer(reducer, initialState)
    const formValues = React.useRef<WrappedFormUtils>()
    const { save, getExamTypes, existsIsDefault, getBasePostGroup, getRecruitmentPhaseFactorType, getInterviewTypes, getLatestCode, get } = useRecruitmentPhaseApi();
    React.useEffect(() => {
        type === SaveType.Insert && handleAddPage()
        type === SaveType.Update && handleEditPage(record.Guid)
    }, [])
    React.useEffect(() => {
        getExamTypes().then((res: SimpleItemViewModel[]) => {
            setExamTypesDataSource(res)
        })
    }, [])
    React.useEffect(() => {
        getInterviewTypes().then((res: SimpleItemViewModel[]) => {
            setInterviewTypesDataSource(res)
        })
    }, [])
    React.useEffect(() => {
        getBasePostGroup(record?.Guid).then((res: SimpleItemViewModel[]) => {
            setBasePostGroupDefine(res)
        })
    }, [])
    React.useEffect(() => {
        setLoadingPage(true)
        getRecruitmentPhaseFactorType().then((res: RecruitmentPhaseFactorTypeViewModel[]) => {
            setFactorTypesDataSource(res)
            setLoadingPage(false)
        })
    }, [])
    const handleAddPage = () => {
        getLatestCode().then((code: number) => {
            setNewCode(code)
        })
        setLoadingPage(false)
    }
    const handleEditPage = (guid: string) => {
        get(guid).then((res: RecruitmentPhaseItemViewModel) => {
            setInitialData(res)
            FactorListtableStore.reset(res.RecruitmentPhaseDetail)
        }).then(setLoadingPage(false))
    }
    const getDefineForm = (form: WrappedFormUtils) => {
        formValues.current = form
    }
    const setBasePostGroupDefine = (values) => {
        dispatch({ type: Types.setBasePostGroupValues, basePostValues: values })
    }

    const setInitialData = (data: RecruitmentPhaseItemViewModel) => {
        dispatch({ type: Types.setInitialData, initialData: data })
    }
    const setNewCode = (code: number) => {
        dispatch({ type: Types.setNewCode, newCode: code })
    }
    const setLoadingPage = (loading: boolean) => {
        dispatch({ type: Types.setLoadingPage, loadingPage: loading })
    }
    const setLoadingSaveButton = (loading: boolean) => {
        dispatch({ type: Types.setLoadingSaveButton, loadingSaveButton: loading })
    }
    const setInterviewTypesDataSource = (dataSource: SimpleItemViewModel[]) => {
        dispatch({ type: Types.setInterviewTypesDataSource, interviewTypesDataSource: dataSource })
    }
    const setExamTypesDataSource = (dataSource: SimpleItemViewModel[]) => {
        dispatch({ type: Types.setExamTypesDataSource, examTypesDataSource: dataSource })
    }
    const setFactorTypesDataSource = (dataSource: RecruitmentPhaseFactorTypeViewModel[]) => {
        dispatch({ type: Types.setFactorTypesDataSource, factorTypesDataSource: dataSource })
    }
    const saveCall = (data: RecruitmentPhaseSaveViewModel) => {
        save(data).then((res: boolean) => {
            setLoadingSaveButton(false);
            Message.success(Language("InformationHasBeenSavedSuccessfully"), 5);
            commnadHandler.closeWindow(true)
            tableStore.refresh()
        }).catch((errors) => {
            setLoadingSaveButton(false);

            Modal.error({
                title: Language('Error'),
                content: Language(ErrorType[errors[0].Type])
            })
        })
    }
    const commnadHandler = useCommandHandler()
    const onSubmit = () => {
        formValues.current.validateFields((errors, values) => {
            if (!errors) {
                if (FactorListtableStore.getAllDataExceptDeletedOne().length > 0) {
                    FactorListtableStore.validateRecords(result => {
                        if (result.success) {
                            const checkUniqTitle = checkUniqenessCulomnTable(FactorListtableStore.getAllDataExceptDeletedOne(), "PhaseTitle")
                            if (!validationDataTable() || !checkUniqTitle) {
                                Modal.error({
                                    title: Language('Error'),
                                    content: Language('DuplicateAndEmptyValueRecruitmentFactors')
                                })
                            }
                            else {
                                const formPanelData: RecruitmentPhaseViewModel = {
                                    Guid: type === SaveType.Update ? record.Guid : "",
                                    ObjectState: type === SaveType.Update ? ObjectState.Modified : ObjectState.Added,
                                    BasePostGroupGuid: values.BasePostGroupGuid ? values.BasePostGroupGuid : '',
                                    Code: values.Code,
                                    Title: values.Title,
                                    IsActive: values.Active,
                                    IsDefault: values.IsDefault,
                                    OperationamUnits: values.OperationamUnits?.map((item) => ({
                                        Id: item.id,
                                        Title: item.title
                                    })),
                                    Id: state.initialData.Id,
                                }
                                const dataChangedTable = FactorListtableStore.getChanges()

                                const dataTables: RecruitmentPhaseDetailSaveModel = {
                                    Added: dataChangedTable.Added.length > 0 ? dataChangedTable.Added.map(item => ({
                                        Guid: item.Guid,
                                        RecruitmentPhaseGuid: type === SaveType.Update ? record.Guid : "",
                                        RecruitmentFactorType: item.RecruitmentFactorType,
                                        RecruitmentFactorExamGuid: item.RecruitmentFactorType === RecruitmentFactorType.Exam ? item.RecruitmentFactorGuid : null,
                                        RecruitmentFactorInterviewGuid: item.RecruitmentFactorType === RecruitmentFactorType.Interview ? item.RecruitmentFactorGuid : null,
                                        ResponsibleStaff: { ID: item.ResponsibleStaff[0].Id, Title: item.ResponsibleStaff[0].Title },
                                        IsActive: item.IsActive,
                                        Number: item.Number,
                                        PhaseTitle: item.PhaseTitle
                                    })) : [],
                                    Edited: dataChangedTable.Edited.length > 0 ? dataChangedTable.Edited.map(item => ({
                                        Guid: item.Guid,
                                        RecruitmentPhaseGuid: record.Guid,
                                        RecruitmentFactorType: item.RecruitmentFactorType,
                                        RecruitmentFactorExamGuid: item.RecruitmentFactorType === RecruitmentFactorType.Exam ? item.RecruitmentFactorGuid : null,
                                        RecruitmentFactorInterviewGuid: item.RecruitmentFactorType === RecruitmentFactorType.Interview ? item.RecruitmentFactorGuid : null,
                                        ResponsibleStaff: { ID: item.ResponsibleStaff[0].Id, Title: item.ResponsibleStaff[0].Title },
                                        IsActive: item.IsActive,
                                        Number: item.Number,
                                        PhaseTitle: item.PhaseTitle
                                    })) : [],
                                    Deleted: dataChangedTable.Deleted.length > 0 ? dataChangedTable.Deleted.map(item => ({
                                        Guid: item.Guid,
                                        RecruitmentPhaseGuid: record.Guid,
                                        RecruitmentFactorType: item.RecruitmentFactorType,
                                        RecruitmentFactorExamGuid: item.RecruitmentFactorType === RecruitmentFactorType.Exam ? item.RecruitmentFactorGuid : null,
                                        RecruitmentFactorInterviewGuid: item.RecruitmentFactorType === RecruitmentFactorType.Interview ? item.RecruitmentFactorGuid : null,
                                        ResponsibleStaff: { ID: item.ResponsibleStaff[0].Id, Title: item.ResponsibleStaff[0].Title },
                                        IsActive: item.IsActive,
                                        Number: item.Number,
                                        PhaseTitle: item.PhaseTitle
                                    })) : [],
                                }
                                const saveDataModel: RecruitmentPhaseSaveViewModel = {
                                    RecruitmentPhaseViewModel: formPanelData,
                                    RecruitmentPhaseDetailSaveModel: dataTables
                                }
                                if (values.IsDefault && type === SaveType.Insert) {
                                    existsIsDefault().then((res: boolean) => {
                                        if (!!res) {
                                            Modal.confirm({
                                                title: Language("ChangeDefaultPatternAfterSave"),
                                                onOk() {
                                                    saveCall(saveDataModel);
                                                },
                                                onCancel() { }
                                            });
                                        }
                                        else {
                                            saveCall(saveDataModel)
                                        }
                                    })
                                }
                                else {
                                    saveCall(saveDataModel)
                                }
                            }
                        }
                    })
                }
                else {
                    Modal.error({
                        title: Language('Error'),
                        content: Language('DonotValueRecruitmentFactors')
                    })
                    setLoadingSaveButton(false);
                }
            }
        })
    }

    function validationDataTable() {
        let result: boolean
        const examFactorRows = FactorListtableStore.getAllDataExceptDeletedOne().filter(row => row.RecruitmentFactorType === 1)
        const interviewFactorRows = FactorListtableStore.getAllDataExceptDeletedOne().filter(row => row.RecruitmentFactorType === 2)
        const checkUniqExamType = checkUniqenessCulomnTable(examFactorRows, "RecruitmentFactorGuid")
        const checkUniqInterviewType = checkUniqenessCulomnTable(interviewFactorRows, "RecruitmentFactorGuid")
        result = (checkUniqExamType && checkUniqInterviewType) ? true : false
        return result
    }
    const FactorListtableStore = React.useRef<TableExEditStore<any, string>>(
        new TableExEditStore<any, string>({
            keyField: 'Guid',
            data: []
        })).current

    return (
        <FormLayout>
            <FormLayout.LayoutContent>
                {state.loadingPage ? <div><Spin spinning></Spin></div> :
                    <>
                        <Alert type='info'
                            showIcon
                            message={Language('RecruitmentPhaseInfo')}
                        />
                        <RecruitmentFactorPanel
                            type={type}
                            record={record}
                            fetchForm={getDefineForm}
                            factorListtableStore={FactorListtableStore}
                            newCode={state.newCode}
                            initData={state?.initialData}
                            basePostValues={state.basePostValues}
                            accessDefine={accessDefine}
                        />
                        {state.factorTypesDataSource.length > 0 &&
                            < RecruitmentFactorList store={FactorListtableStore}
                                factorType={state.factorTypesDataSource}
                                accessDefine={accessDefine}
                            />
                        }
                    </>
                }
            </FormLayout.LayoutContent>
            {accessDefine &&
                <FormLayout.ActionBar>
                    <Button onClick={onSubmit} type={"primary"} loading={state.loadingSaveButton}>{Language("Save")}</Button>
                </FormLayout.ActionBar>
            }
        </FormLayout>
    )
}
export default Form.create()(RecruitmentPhaseDefine) 