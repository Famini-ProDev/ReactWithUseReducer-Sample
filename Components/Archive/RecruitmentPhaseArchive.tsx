import * as React from 'react'
import { FormLayout, Form, Message, useCommandHandler, useKeyboard, Button, Modal, WrappedFormUtils, Popconfirm, FormComponentProps } from 'components'
import {  Language } from 'Utility/helper'

function RecruitmentPhaseArchive() {
    const { deleteRecord, getListApi, getAccessPermissions } = useRecruitmentPhaseApi()
    const formData = React.useRef<WrappedFormUtils>()
    const [currentRecord, setCurrentRecord] = React.useState<any>();
    const [loadingDelete, setLoadingDelete] = React.useState<boolean>(false)
    const [accessPermissions, setAccessPermissions] = React.useState<BasicInformationAccessViewModel>()
    React.useEffect(() => {
        getAccessPermissions().then((res: BasicInformationAccessViewModel) => {
            setAccessPermissions(res)
        })
    }, [])
    const tableStore = React.useRef<TableExViewStore<RecruitmentPhaseResultViewModel, string>>(
        new TableExViewStore<RecruitmentPhaseResultViewModel, string>({
            keyField: 'Guid',
            url: getListApi,
            softwareGuid: SoftwareGuid,
            defaultSortField: 'Code',
            defaultSortOrder: "ascend",
            preventAutoFill: true,
        })
    ).current
    function trasnmute(metadata: any): Partial<RecruitmentPhaseSearchViewModel> {
        metadata.Active = metadata.Active && Number(metadata.Active) === 1
        metadata.BasePostGroupGuids = metadata.BasePostGroupGuids ? metadata.BasePostGroupGuids.map((item: { id: string, title: string }) => ({ Id: item.id, Title: item.title })) : []
        metadata.OperationalUnits = metadata.OperationalUnits ? metadata.OperationalUnits.map((item: { id: string, title: string }) => ({ Id: item.id, Title: item.title })) : []
        return metadata
    }
    function onSearch() {
        const metadata: Partial<RecruitmentPhaseSearchViewModel> = formData.current.getFieldsValue()
        tableStore.refresh({ metadata: trasnmute(metadata) })
        setCurrentRecord(undefined)
    }
    const fetchForm = (form: WrappedFormUtils) => {
        formData.current = form
    }
    const commnadHandler = useCommandHandler()
    function onAdd(e: BasicInformationViewModel | any) {
        commnadHandler.openControlFormByCode({
            controlCode: Controls.BasicInformation_RecruitmentPhaseDefine,
            dtoObject: {
                record: e.Guid && e,
                type: e.Guid ? SaveType.Update : SaveType.Insert,
                accessDefine: accessPermissions && accessPermissions.DefineRecruitmentPhase
            },
            options: {
                title: e.Guid ? Language("RecruitmentPhaseDefine") : Language("DefineRecruitmentPhase")
            }
        }).then(e => tableStore.refresh())

        setCurrentRecord(undefined)
    }

    function onDelete() {
        if (tableStore.getSelectedRecords().length > 0) {
            setLoadingDelete(true)
            const currentGuid = tableStore.getSelectedRecords()[0].Guid
            deleteRecord(currentGuid)
                .then(result => {
                    Message.success(Language('DeletionCompletedSuccessfully'));
                    tableStore.refresh()
                    setLoadingDelete(false)
                    setCurrentRecord(undefined)
                }).catch(errors => Modal.error({
                    title: Language('Error'),
                    content: Language(ErrorType[errors[0].Type]),
                }))
            setLoadingDelete(false)
        }
        else {
            Message.error(Language("PleaseSelectOne"), 5);
        }
    }
    function onRowSelect(e: RecruitmentPhaseResultViewModel) {
        setCurrentRecord(e)
    }

    const handleKeyDown = React.useCallback((e) => {
        if (e.keyCode === KeyCode.ENTER) {
            e.preventDefault();
            onSearch();
        }
    }, []);
    useKeyboard('keydown', handleKeyDown);

    return (<>
        <FormLayout>
            <FormLayout.LayoutContent>
                <RecruitmentPhasePanel
                    onSearch={onSearch}
                    fetchForm={fetchForm}
                />
                    <RecruitmentPhaseList
                        tableStore={tableStore}
                        onRowSelect={onRowSelect}
                        setSelectedRecord={setCurrentRecord}
                        accessDefine={accessPermissions.DefineRecruitmentPhase}
                        onRowDoubleClick={(e) => onAdd(e)}
                    />
                <FormLayout.ActionBar>
                    {accessPermissions && accessPermissions.DefineRecruitmentPhase &&
                        <Button onClick={onAdd}>
                            {Language('Add')}
                        </Button>
                    }
                    {accessPermissions && accessPermissions.DeleteRecruitmentPhase &&
                        <Popconfirm title={Language("AreYouSure")} onConfirm={onDelete}>
                            <TooltipedButton loading={loadingDelete} overlay={Language('PleaseSelectOne')} condition={!currentRecord} onClick={() => { }} title={Language('Delete')} />
                        </Popconfirm>
                    }
                </FormLayout.ActionBar>
            </FormLayout.LayoutContent>
        </FormLayout>

    </>
    )
}
export default Form.create()(RecruitmentPhaseArchive)