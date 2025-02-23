import { FormHTMLAttributes } from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";

export interface FormRootProps<T extends FieldValues>
  extends FormHTMLAttributes<HTMLFormElement> {
  form: UseFormReturn<T>;
  useDefaultStyle?: boolean;
}

export function FormRoot<T extends FieldValues>({
  form,
  useDefaultStyle = true,
  ...props
}: FormRootProps<T>) {
  return (
    <FormProvider {...form}>
      <form
        noValidate
        autoComplete="off"
        {...props}
        data-default-style={useDefaultStyle}
      />
    </FormProvider>
  );
}
