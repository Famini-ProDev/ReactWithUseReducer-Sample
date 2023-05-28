import * as React from "react";
import { FieldRenderer, SelectValue } from "components";
import { transformGuidToKeyValue } from "Utility/helper";

interface SelectExCustomFieldProps {
    record?: any,
    value?: SelectValue;
    onChange?: (value: any) => void;
    factorType: RecruitmentPhaseFactorTypeViewModel[];
}
function SelectExCustom({ onChange, record, factorType }: SelectExCustomFieldProps) {
    const typeSelectExSource = React.useMemo((): SimpleItemViewModel[] => {
        return factorType.filter(item => item.Type === record.RecruitmentFactorType)
    }, [factorType, record.RecruitmentFactorType])
    return (
        <FieldRenderer.Editors.SelectEditor
            dataSource={transformGuidToKeyValue(typeSelectExSource)}
            value={record.RecruitmentFactorGuid}
            onChange={onChange}
        />
    )
}
export default SelectExCustom

