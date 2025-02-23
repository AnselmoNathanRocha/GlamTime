import { ErrorMessage } from "../ErrorMessage";
import { useFormContext } from "react-hook-form";
import { cn } from "@/utils/functions";
import React from "react";

export interface OptionsData {
  value: string;
  label: string;
}

interface SelectFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: OptionsData[];
  defaultValue?: string;
  icon?: React.ReactNode;
  errorMessage?: string;
}

export function Select({
  label,
  name,
  options,
  defaultValue = "",
  icon,
  errorMessage = "",
  ...props
}: SelectFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors[name];

  return (
    <div
      className={cn("w-full flex flex-col relative", {
        "mb-5": !!fieldError || !!errorMessage,
      })}
    >
      {icon && (
        <i className="absolute top-3 left-3 text-neutral-300 text-base">
          {icon}
        </i>
      )}

      <select
        {...register(name)}
        {...props}
        defaultValue={defaultValue}
        aria-invalid={!!fieldError}
        className={cn(
          "w-full h-10 rounded-md border border-gray-300 bg-transparent pl-9 focus:border focus:border-green-600 focus:shadow-green focus:outline-none disabled:opacity-60",
          {
            "outline outline-1 outline-gray-300 border-red-400": !!fieldError,
            "px-3": !icon,
          }
        )}
      >
        <option value="" disabled>
          Selecione {label.toLowerCase()}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label
        htmlFor={name}
        className="absolute -top-2 left-5 text-xs text-green-600 bg-gray-100 px-1"
      >
        {label}
      </label>

      {!!fieldError && (
        <div className="absolute -bottom-4 z-10">
          <ErrorMessage
            field={name}
            errorMessage={String(fieldError.message)}
          />
        </div>
      )}
      {!!errorMessage && (
        <div className="absolute -bottom-8 z-10">
          <ErrorMessage field={name} errorMessage={errorMessage} />
        </div>
      )}
    </div>
  );
}
