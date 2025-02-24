import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "../ErrorMessage";
import { cn } from "@/utils/functions";

export interface OptionsData {
  value: string | boolean;
  label: string;
}

interface CheckGroupProps {
  label: string;
  name: string;
  options: OptionsData[];
  multiple?: boolean;
  defaultValue?: string | boolean | string[];
  errorMessage?: string;
}

export function CheckGroup({
  label,
  name,
  options,
  multiple = true,
  defaultValue,
  errorMessage = "",
  ...props
}: CheckGroupProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const fieldError = errors[name];
  const fieldValue = watch(name) ?? (multiple ? [] : "");

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current && defaultValue !== undefined) {
      setValue(name, defaultValue, { shouldValidate: false });
      hasInitialized.current = true;
    }
  }, [defaultValue, name, setValue]);

  const handleChange = (optionValue: string | boolean) => {
    if (multiple) {
      const currentArray: (string | boolean)[] = Array.isArray(fieldValue)
        ? fieldValue
        : [];
      let newValue: (string | boolean)[];
      if (currentArray.includes(optionValue)) {
        newValue = currentArray.filter((val) => val !== optionValue);
      } else {
        newValue = [...currentArray, optionValue];
      }
      setValue(name, newValue, { shouldValidate: true });
    } else {
      setValue(name, optionValue, { shouldValidate: true });
    }
  };

  return (
    <div
      className={cn("w-full flex flex-col relative", {
        "mb-5": !!fieldError || !!errorMessage,
      })}
      {...props}
    >
      <span className="mb-1 text-sm font-medium text-gray-500">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const isChecked = multiple
            ? Array.isArray(fieldValue) && fieldValue.includes(option.value)
            : fieldValue === option.value;

          return (
            <div
              key={`${option.value}-${option.label}`}
              className="flex items-center gap-1"
            >
              <div className="relative cursor-pointer">
                <label
                  htmlFor={id}
                  className="cursor-pointer relative flex size-4.5 items-center justify-center overflow-hidden rounded-full bg-sky-700 p-[2px] duration-100 hover:p-[3px]"
                >
                  <input
                    type={multiple ? "checkbox" : "radio"}
                    id={id}
                    checked={isChecked}
                    onChange={() => handleChange(option.value)}
                    className="peer hidden"
                  />
                  <span className="h-full w-full rounded-full bg-white peer-checked:h-0 peer-checked:w-0"></span>
                  <div className="absolute left-[3px] h-[1.5px] w-[6.5px] -translate-y-3 translate-x-3 rotate-[-41deg] rounded-sm bg-white duration-300 peer-checked:translate-x-1 peer-checked:translate-y-[1px]"></div>
                  <div className="absolute left-[3.5px] top-[6px] h-[1.5px] w-[4px] -translate-x-3 -translate-y-3 rotate-[45deg] rounded-sm bg-white duration-300 peer-checked:translate-x-[1px] peer-checked:translate-y-1"></div>
                </label>
              </div>
              <label htmlFor={id} className="cursor-pointer">
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
      {!!fieldError && (
        <div className="absolute -bottom-4 z-10">
          <ErrorMessage
            field={name}
            errorMessage={fieldError.message?.toString() || "Campo obrigatório"}
          />
        </div>
      )}
      {!!errorMessage && !fieldError?.message && (
        <div className="absolute -bottom-8 z-10">
          <ErrorMessage field={name} errorMessage={errorMessage} />
        </div>
      )}
    </div>
  );
}
