import * as React from 'react'
import { Button, Radio, WrappedFormUtils, Fieldset, Form, Input, NumericalInput, SelfOrderedForm, MultiSelectList, MultiSelectListRemoteDataSource } from 'didgah/components'
import { getApiUrl, Language } from 'Utility/helper'

interface RecruitmentPhasePanelProps {
    onSearch: () => void
    form?: WrappedFormUtils
    fetchForm: (form: WrappedFormUtils) => void
}
function RecruitmentPhasePanel({ fetchForm, form, onSearch }: RecruitmentPhasePanelProps) {
    const { getFieldDecorator } = form
    React.useEffect(() => {
        fetchForm(form)
    }, [])
    const itemStyle: any = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    }
    const basePostGroupsDataSource: MultiSelectListRemoteDataSource = {
        url: getApiUrl('Common', 'RecruitmentCommon', 'GetBasePostGroups'),
        dataLabelName: 'Title',
        dataValueName: 'Id'
    }
    const operationalUnitsDataSource: MultiSelectListRemoteDataSource = {
        url: getApiUrl('Common', 'RecruitmentCommon', 'GetOperationalUnits'),
        dataLabelName: 'Title',
        dataValueName: 'Id'
    }
    return (
        <div>
            <Fieldset legend={Language('Search')} >
                <SelfOrderedForm numberOfColumns={2}>
                    <Form.Item label={Language('Code')} {...itemStyle}>
                        {getFieldDecorator('Code')(<NumericalInput allowNegativeNumbers={false} allowFloatNumbers={false} doNotConvertValueToNumber={true} />)}
                    </Form.Item>
                    <Form.Item label={Language('Title')} {...itemStyle}>
                        {getFieldDecorator('Title')
                            (<Input />)}
                    </Form.Item>
                    <Form.Item label={Language('OperationalUnit')}{...itemStyle}>
                        {getFieldDecorator('OperationalUnits')(<MultiSelectList
                            maxHeight={70}
                            checkboxListTitle={Language('OperationalUnit')}
                            remoteDataSource={operationalUnitsDataSource} />)}
                    </Form.Item>
                    <Form.Item label={Language('BasePostGroup')}{...itemStyle}>
                        {getFieldDecorator('BasePostGroupGuids')(<MultiSelectList
                            maxHeight={70}
                            checkboxListTitle={Language('BasePostGroup')}
                            remoteDataSource={basePostGroupsDataSource} />)}
                    </Form.Item>
                    <Form.Item label={Language('Conditions')} {...itemStyle}>
                        {getFieldDecorator('ActicationStatus', { initialValue: 2 })
                            (<Radio.Group >
                                <Radio key={1} value={1} >{Language('Active')}</Radio>
                                <Radio key={0} value={0} >{Language('DeActive')}</Radio>
                                <Radio key={2} value={2}>{Language('Both')}</Radio>
                            </Radio.Group>)
                        }
                    </Form.Item>
                </SelfOrderedForm>
                <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '5px' }}>
                    <Button type='primary' onClick={onSearch}>
                        {Language('Search')}
                    </Button>

                </div>
            </Fieldset>

        </div>
    )
}
export default Form.create()(RecruitmentPhasePanel)