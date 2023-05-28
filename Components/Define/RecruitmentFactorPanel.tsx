import * as React from 'react'
import { WrappedFormUtils, Fieldset, Form, Input, NumericalInput, SelfOrderedForm, MultiSelectList, TokenItem, MultiSelectListRemoteDataSource, Checkbox, FieldRule, SelectEx, Spin } from 'components'
import { getApiUrl, Language, transformGuidToKeyValue } from 'Utility/helper'
import { TableExEditStore } from 'components/providers'

interface RecruitmentFactorPanelProps {
    form?: WrappedFormUtils
    fetchForm: (form: WrappedFormUtils) => void
    record: BasicInformationViewModel
    type: SaveType
    factorListtableStore: TableExEditStore<any, string>
    newCode: number
    initData: RecruitmentPhaseItemViewModel
    basePostValues: SimpleItemViewModel[]
    accessDefine: boolean
}
function RecruitmentFactorPanel({ form, basePostValues, initData, accessDefine, fetchForm, type, newCode }: RecruitmentFactorPanelProps) {
    const { getFieldDecorator } = form
    const [loadingPanelForm, setLoadingPanelForm] = React.useState<boolean>(false)
    React.useEffect(() => {
        fetchForm(form)
    }, [])

    React.useEffect(() => {
        if (type === SaveType.Update && initData) {
            setLoadingPanelForm(true)
            const selectedOperationamUnits: TokenItem[] = [];
            initData.OperationalUnit.map(x => {
                selectedOperationamUnits.push({
                    id: x.Id.toString(),
                    title: x.Title
                });
            });
            form.setFieldsValue({ ...initData, BasePostGroupGuid: initData.BasePostGroupGuid?.Guid, OperationamUnits: selectedOperationamUnits })
            setLoadingPanelForm(false)
        }
    }, [initData])
    React.useEffect(() => {
        type === SaveType.Insert && handleAdd()
    }, [newCode])
    const handleAdd = () => {
        form.resetFields()
        form.setFieldsValue({ Code: newCode })
    }
    const itemStyle: any = {
        labelCol: { span: 8 },
        wrapperCol: { span: 15 }
    }
    const operationalUnitsDataSource: MultiSelectListRemoteDataSource = {
        url: getApiUrl('Common', 'RecruitmentCommon', 'GetOperationalUnits'),
        dataLabelName: 'Title',
        dataValueName: 'Id'
    }
    const codeValidator = (rule: FieldRule, value: number, callback: any) => {
        value === 0 ? callback({ message: Language('DonotAllowZeroCode') }) : callback()
    }
    return (
        <div>
            {loadingPanelForm ? <div><Spin spinning></Spin></div> :
                <Fieldset heightRatio={1} collapsible={false} legend={Language('BasicInformation')}>
                    <SelfOrderedForm numberOfColumns={2}>
                        <Form.Item {...itemStyle} label={Language('Code')} >
                            {getFieldDecorator('Code', { rules: [{ required: true }, { validator: codeValidator }] })(<NumericalInput readOnly={!accessDefine} allowNegativeNumbers={false} allowFloatNumbers={false} doNotConvertValueToNumber={true} />)}
                        </Form.Item>
                        <Form.Item {...itemStyle} label={Language('Title')}>
                            {getFieldDecorator('Title', { rules: [{ required: true }] })
                                (<Input type={"text"} readOnly={!accessDefine} />)}
                        </Form.Item>
                        <Form.Item {...itemStyle} label={Language('BasePostGroup')}>
                            {getFieldDecorator('BasePostGroupGuid')(
                                <SelectEx
                                    disabled={!accessDefine}
                                    allowClear
                                    dataSource={transformGuidToKeyValue(basePostValues)} />)}
                        </Form.Item>
                        <Form.Item label={Language('OperationalUnit')}{...itemStyle}>
                            {getFieldDecorator('OperationamUnits')(<MultiSelectList
                                maxHeight={70}
                                readOnly={!accessDefine}
                                checkboxListTitle={Language('OperationalUnit')}
                                remoteDataSource={operationalUnitsDataSource} />)}
                        </Form.Item>
                        <Form.Item {...itemStyle} label={Language('Default')}>
                            {getFieldDecorator('IsDefault', { valuePropName: 'checked', initialValue: true })
                                (<Checkbox disabled={!accessDefine} />)}
                        </Form.Item>
                    </SelfOrderedForm>
                </Fieldset>
            }

        </div>
    )
}
export default Form.create()(RecruitmentFactorPanel)