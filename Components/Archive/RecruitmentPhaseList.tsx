import * as React from 'react'
import { BooleanViewerField, Fieldset, Modal, TableEx, TableExColumnProps, TextViewerField } from 'components'
import { Language } from 'Utility/helper'

interface RecruitmentPhaseListProps {
    tableStore: TableExViewStore<BasicInformationViewModel, string>
    onRowDoubleClick: (e: RecruitmentPhaseResultViewModel) => void
    onRowSelect: (e: RecruitmentPhaseResultViewModel) => void
    setSelectedRecord: (state: RecruitmentPhaseResultViewModel) => void
    accessDefine: boolean
}

export default function RecruitmentPhaseList({ tableStore, onRowSelect, accessDefine, onRowDoubleClick, setSelectedRecord }: RecruitmentPhaseListProps) {

    const { toggleActivation, defaultActivation, existsIsDefault } = useRecruitmentPhaseApi()
    function handleToggleActive(record: RecruitmentPhaseResultViewModel) {
        if (!!record.IsDefault && !!record.Active) {
            Modal.error({
                title: Language('Error'),
                content: Language('DefaultCannotBeDeActive'),
            })
        }
        else {
            toggleActivation(record).then(res => {
                tableStore.refresh()
                setSelectedRecord(undefined)
            }).catch(errors => {
                if (errors.Type = ErrorType.ExistsIsDefault) {
                    Modal.error({
                        title: Language('Error'),
                        content: Language('DefaultCannotBeDeActive'),
                    })
                }
            })
        }

    }
    function handleToggleDefault(record: RecruitmentPhaseResultViewModel) {
        existsIsDefault().then((res: boolean) => {
            if (!!res) {
                Modal.confirm({
                    title: Language("DoYouChangeDefaultPattern"),
                    onOk() {
                        toggleDefaultCall(record);
                        setSelectedRecord(undefined)
                    },
                    onCancel() { }
                });
            }
            else {
                toggleDefaultCall(record);
                setSelectedRecord(undefined)
            }
        })
    }
    const toggleDefaultCall = (record: RecruitmentPhaseResultViewModel) => {
        defaultActivation({ Guid: record.Guid }).then(res => {
            tableStore.refresh()
        }).catch(error => {
            Modal.error({
                title: Language('Error'),
                content: Language(ErrorType[error[0].Type]),
            })
        })
    }

    const columnRef = React.useRef<TableExColumnProps<RecruitmentPhaseResultViewModel>[]>([
        {
            title: Language('Active'),
            dataIndex: 'Active',
            width: 20,
            sortEnabled: true,
            viewType: new BooleanViewerField({ onClick: accessDefine && handleToggleActive }),
            align: 'center'
        },
        {
            title: Language('Default'),
            dataIndex: 'IsDefault',
            width: 20,
            sortEnabled: true,
            viewType: new BooleanViewerField({ onClick: accessDefine && handleToggleDefault }),
            align: 'center'
        },
        {
            title: Language('Code'),
            dataIndex: 'Code',
            width: 30,
            viewType: new TextViewerField(),
            sortEnabled: true,
            align: 'center'
        },
        {
            title: Language('Title'),
            dataIndex: 'Title',
            viewType: new TextViewerField(),
            width: 80,
            align: 'center',
            sortEnabled: true
        },
        {
            title: Language('BasePostGroup'),
            dataIndex: 'BasePostGroup',
            viewType: new TextViewerField(),
            width: 60,
            sortEnabled: true,
            align: 'center'
        },
    ]).current

    return (
        <Fieldset legend={Language('Results')} heightRatio={1} collapsible={false}>
            <TableEx store={tableStore}
                columns={columnRef}
                onRowClick={onRowSelect}
                onRowDoubleClick={onRowDoubleClick}
            />
        </Fieldset>
    )
}