import { CurrencyInput } from "react-currency-mask";
import { Controller, useFormContext } from "react-hook-form";
import { Input, InputProps } from "../Input";

export function DecimalInput(props: InputProps) {
    const { control } = useFormContext();

    return (
        <Controller
            name={props.name}
            control={control}
            render={({ field }) => (
                <CurrencyInput
                    value={field.value}
                    onChangeValue={(_, value) => field.onChange(value)}
                    InputElement={<Input {...props} />}
                />
            )}
        />
    );
}