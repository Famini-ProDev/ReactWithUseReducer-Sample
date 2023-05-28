import * as React from "react";
import SelectIndividual, { SelectIndividualComponentTypes } from '@components/selectindividual';
import { SelectIndividualStore } from '@/selectindividual';
import { Individual } from "@components/selectindividual/typing/Models/Individual";

interface SelectIndividualCustomFieldProps {
    value?: SimpleItemWithStaffIdViewModel[];
    onChange?: (value: SimpleItemWithStaffIdViewModel[]) => void;

}
function SelectIndividualCustom({ value, onChange }: SelectIndividualCustomFieldProps) {
    function handleChange(value: Individual[]) {
        if (!!onChange) {
            let selectValue: SimpleItemWithStaffIdViewModel[] = value?.map(c => {
                return ({ ID: c.Id as any as number, Title: c.Title });
            }) ?? [];
            onChange(selectValue);
        }
    }
    const SelectIndividualValue = React.useMemo((): Individual[] => {
        return value?.map(c => {
            return ({ Id: c.ID.toString(), Title: c.Title, CommandType: undefined, Metadata: undefined, Type: undefined });
        }) ?? [];
    }, [value])

    return (
        <SelectIndividual
            components={[new SelectIndividualComponentTypes.SelectStaff({ multiSelect: false })]}
            commands={[]}
            store={new SelectIndividualStore([])}
            mode='normal'
            value={SelectIndividualValue}
            selectedItems={SelectIndividualValue}
            onChange={handleChange}
            maxSelectedItems={1}
        />
    )
}
export default SelectIndividualCustom

