import * as React from 'react'
import { TableEx, Fieldset, TableExColumnProps, EnumViewerField, EnumEditorField, SelectViewerField, BooleanViewerField, CheckboxEditorField, TextEditorField, DecimalViewerField, TextViewerField, KeyValuePairViewerField, AutoCompleteEditorField, NumberEditorField, SelectEx, TextViewerComponentField, IndexerViewerField, IndexerEditorField } from 'didgah/components'
import { Language, SoftwareGuid, transformGuidToKeyValue } from 'Utility/helper'
import { TableExEditStore } from 'components/providers'
import { FieldEditorType, FieldViewerType } from '@models/components'
import SelectExCustom from './CustomComponents/SelectExCustom'
import SelectIndividualCustom from './CustomComponents/SelectIndividualCustom'
interface RecruitmentFactorListProps {
    store: TableExEditStore<any, string>
    factorType: RecruitmentPhaseFactorTypeViewModel[]
    accessDefine: boolean
}
export enum RecruitmentFactorTypeLocal {
    Exam = 1,
    Interview = 2,
}
const RecruitmentFactorList = ({ store, factorType, accessDefine }: RecruitmentFactorListProps) => {
    const factorTypeSelectExValue = React.useMemo((): SimpleItemViewModel[] => {
        return factorType
    }, [factorType])

    const columns = React.useRef<TableExColumnProps<any>[]>([
        {
            title: Language('Row'),
            dataIndex: 'Number',
            viewType: new TextViewerField(),
            editType: new NumberEditorField(),
            width: '40',
            align: 'center',
            editDisabled: true
        },
        {
            title: Language('Active'),
            dataIndex: 'IsActive',
            viewType: new BooleanViewerField(),
            editType: new CheckboxEditorField(),
            width: '40',
            align: 'center',
            editDisabled: !accessDefine
        },
        {
            title: Language('TitleStep'),
            dataIndex: 'PhaseTitle',
            viewType: new TextViewerField(),
            editType: new TextEditorField(),
            width: '100',
            align: 'center',
            editDisabled: !accessDefine,
            rules: [{ required: true }],
        },
        {
            title: Language('RecruitmentFactor'),
            dataIndex: 'RecruitmentFactorType',
            align: 'center',
            width: '100',
            editDisabled: !accessDefine,
            viewType: new EnumViewerField(RecruitmentFactorTypeLocal, SoftwareGuid),
            editType: new EnumEditorField(RecruitmentFactorTypeLocal, SoftwareGuid),
        },
        {
            title: Language('Type'),
            dataIndex: 'RecruitmentFactorGuid',
            align: 'center',
            width: '100',
            viewType: new SelectViewerField(transformGuidToKeyValue(factorTypeSelectExValue)),
            editComponent: SelectExCustom,
            editType: { type: FieldEditorType.Custom, factorType: factorType },
            checkEditDisable: (record: any) => record.RecruitmentFactorType === null || !accessDefine,
        },
        {
            title: Language('ResponsibleStep'),
            dataIndex: 'ResponsibleStaff',
            align: 'center',
            width: '130',
            rules: [{ required: true }],
            viewType: { type: FieldViewerType.Custom },
            editType: { type: FieldEditorType.Custom },
            editComponent: SelectIndividualCustom,
            editDisabled: !accessDefine,
            viewComponent: ({ value, record, dataIndex }) => { return <TextViewerComponentField value={!!record[dataIndex]?.length ? record[dataIndex][0].Title : ''} showTooltip={true} /> }
        }
    ]).current;

    const onchangeTable = (record, oldValue: any, newValue: any, dataIndex: string) => {
        if (dataIndex === "RecruitmentFactorType") {
            record.RecruitmentFactorInterviewGuid = null
            record.RecruitmentFactorExamGuid = null
        }
        store.update(record);
    }
    const handleAfterAddRow = (record: any) => {
        const recordsTable = store.getAllDataExceptDeletedOne()
        record[0].Number = recordsTable.length > 1 ? recordsTable[recordsTable.length - 2].Number + 1 : 1
        record[0].IsActive = true
        store.update(record[0])
    }
    return (
        <Fieldset legend={Language('RecruitmentFactors')} heightRatio={1} collapsible={false}>
            <TableEx
                store={store}
                columns={columns}
                disablePagination
                onChange={onchangeTable}
                onAfterAdd={handleAfterAddRow}
                showAddRemoveColumn={accessDefine}
            />
        </Fieldset>
    )
}
export default RecruitmentFactorList;
