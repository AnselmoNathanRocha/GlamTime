import { InputHTMLAttributes, useCallback, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "../ErrorMessage";
import { Loader } from "@/components/Loader";
import { MaskType, masks } from "@/utils/masks";

export interface TaskInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  mask?: MaskType;
  name: string;
  placeholder?: string;
  buttonLabel: string;
  loading: boolean;
  showErrorMessage?: boolean;
}

export function TaskInput({
  name,
  mask,
  buttonLabel,
  loading,
  showErrorMessage = true,
  ...props
}: TaskInputProps) {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const fieldError = errors[name];

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
    <div className="w-full flex">
      <div className="flex-1 relative">
        <input
          id={name}
          onInput={handleInputMask}
          {...register(name)}
          {...props}
          placeholder=" "
          className={
            "w-full h-8 px-3 bg-transparent border border-solid border-slate-200 rounded-l-md text-slate-200"
          }
        />
        {showErrorMessage && fieldError && <ErrorMessage field={name} />}
      </div>

      <button className="w-16 h-8 flex justify-center items-center gap-1 bg-slate-200 rounded-r-md text-green-600 text-sm font-semibold hover:bg-slate-300">
        {loading ? <Loader className="size-6" /> : buttonLabel}
      </button>
    </div>
  );
}