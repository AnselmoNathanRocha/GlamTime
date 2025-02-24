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
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  errorMessage?: string;
  showErrorMessage?: boolean;
}

export function Select({
  label,
  name,
  options,
  defaultValue = "",
  leftIcon,
  rightIcon,
  errorMessage = "",
  showErrorMessage = true,
  ...props
}: SelectFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors[name];

  return (
    <div className="w-full rounded-md my-1">
      <div className="w-full h-14 rounded-lg relative">
        {leftIcon && (
          <i className="absolute top-[11px] left-3 text-lg text-neutral-300">
            {leftIcon}
          </i>
        )}

        <select
          {...register(name)}
          {...props}
          defaultValue={defaultValue}
          aria-invalid={!!fieldError}
          className={cn(
            "outline-none peer w-full h-14 rounded-2xl bg-transparent text-base px-4 font-normal text-zinc-600 disabled:opacity-50 bg-gray-200 pt-2 appearance-none",
            {
              "border border-solid border-red-400": !!fieldError,
              "focus:border focus:border-solid focus:border-sky-800": !fieldError,
              "pl-10": !!leftIcon,
              "pr-10": !!rightIcon,
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
          className={cn(
            "absolute top-1 text-xs text-gray-400 px-1 py-0 peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-sky-700",
            {
              "left-3 peer-placeholder-shown:left-3 peer-focus:left-3": !leftIcon,
              "left-5 peer-placeholder-shown:left-10 peer-focus:left-5": !!leftIcon,
            }
          )}
        >
          {label}
        </label>

        {rightIcon && (
          <i className="absolute top-5 right-4 text-base">{rightIcon}</i>
        )}
      </div>

      {showErrorMessage && fieldError && (
        <ErrorMessage field={name} errorMessage={String(fieldError.message)} />
      )}
      {showErrorMessage && errorMessage && (
        <ErrorMessage field={name} errorMessage={errorMessage} />
      )}
    </div>
  );
}
