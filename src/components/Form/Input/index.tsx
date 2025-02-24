import { MaskType, masks } from "@/utils/masks";
import { InputHTMLAttributes, ReactNode, useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "../ErrorMessage";
import { cn } from "@/utils/functions";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  mask?: MaskType;
  name: string;
  placeholder?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  permitNegativeValues?: boolean;
  showErrorMessage?: boolean;
  errorMessage?: string;
}

export function Input({
  id,
  name,
  mask,
  leftIcon,
  rightIcon,
  permitNegativeValues,
  showErrorMessage = true,
  errorMessage,
  className,
  ...props
}: InputProps) {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors[name];

  const additionalProps: InputHTMLAttributes<HTMLInputElement> = {};

  if (props.type === "number" && !permitNegativeValues) {
    additionalProps.min = "0";
  }

  const handleInputMask = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      if (mask && typeof masks[mask] === "function") {
        masks[mask](event);
      }
    },
    [mask]
  );

  useEffect(() => {
    const currentValue = getValues(name) || "";
    if (!mask || currentValue === undefined) return;

    const maskedValue = masks[mask](currentValue.toString());
    setValue(name, maskedValue, { shouldDirty: false, shouldTouch: false });
  }, [mask, name, setValue, getValues]);

  return (
    <div className="w-full rounded-md my-1">
      <div className="w-full h-14 rounded-lg relative">
        {leftIcon && (
          <i className="absolute top-[11px] left-3 text-lg text-neutral-300">
            {leftIcon}
          </i>
        )}

        <input
          id={id ?? name}
          onInput={handleInputMask}
          {...register(name, {
            valueAsNumber: props.type === "number" ? true : undefined,
          })}
          {...props}
          {...additionalProps}
          placeholder=" "
          className={cn(
            "peer w-full h-14 rounded-2xl bg-transparent text-base px-4 font-normal text-zinc-600 disabled:opacity-50 bg-gray-200 pt-2",
            {
              "border border-solid border-red-400":
                !!fieldError || errorMessage,
              "focus:border focus:border-solid focus:border-sky-800":
                !fieldError,
              "pl-10 ": !!leftIcon,
              "pr-10": !!rightIcon,
            },
            className
          )}
        />

        <label
          htmlFor={id ?? name}
          className={cn(
            "absolute top-1 text-xs text-gray-400 px-1 py-0 peer-placeholder-shown:top-4.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-sky-700",
            {
              "left-3 peer-placeholder-shown:left-3 peer-focus:left-3":
                !leftIcon,
              "left-5 peer-placeholder-shown:left-10 peer-focus:left-5":
                !!leftIcon,
            }
          )}
        >
          {props.label}
        </label>

        {rightIcon && (
          <i className="absolute top-5 right-4 text-base">{rightIcon}</i>
        )}
      </div>

      {showErrorMessage && (
        <ErrorMessage field={name} errorMessage={errorMessage} />
      )}
    </div>
  );
}
