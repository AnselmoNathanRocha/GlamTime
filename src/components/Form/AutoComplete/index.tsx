import { useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FaChevronDown } from "react-icons/fa6";
import { ErrorMessage } from "../ErrorMessage";
import { cn } from "@/utils/functions";

export interface OptionData {
  value: string | number | boolean;
  label: string;
}

interface SelectProps {
  options: OptionData[];
  name: string;
  label: string;
  emptyOption?: JSX.Element;
  positionOptionBox?: "top" | "bottom";
  disabled?: boolean;
  onChange?: (value: string | number | boolean) => void;
  keyboardDisabled?: boolean;
}

export function AutoComplete({
  name,
  label,
  options,
  emptyOption,
  positionOptionBox,
  disabled = false,
  keyboardDisabled = true,
  onChange,
}: SelectProps) {
  const { control, formState, watch } = useFormContext() || {};
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>(
    () =>
      options.find(({ value }) => value === formState.defaultValues?.[name])
        ?.label || ""
  );
  const [selectedOption, setSelectedOption] = useState<OptionData | null>(
    () =>
      options.find(({ value }) => value === formState.defaultValues?.[name]) ||
      null
  );
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const filteredOptions = options.filter((option) =>
    option.label.toUpperCase().includes(filter.toUpperCase())
  );

  useEffect(() => {
    if (!showOptions) {
      setFilter(selectedOption?.label || "");
    }
  }, [showOptions, selectedOption]);

  useEffect(() => {
    const subscription = watch((values) => {
      if (values[name] === undefined) {
        setFilter("");
        setSelectedOption(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [name, watch]);

  function handleInputFilterBlur() {
    setTimeout(() => {
      if (
        !document.activeElement?.id.startsWith(`autocompleteoption-${name}`)
      ) {
        setShowOptions(false);
      }
    }, 300);
  }

  const labelColor =
    filter || selectedOption ? (isFocused ? "#0369a1" : "#9CA3AF") : "#9CA3AF";

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => (
        <div className="w-full rounded-md my-1">
          <div
            data-invalid={fieldState.invalid}
            data-position-option-box={positionOptionBox}
            data-disabled={disabled}
            className="relative w-full"
          >
            <div className="w-full flex flex-col relative">
              <div className="relative">
                <input
                  type="text"
                  id={`autocomplete-${name}-input-filter`}
                  value={filter}
                  onChange={({ target }) => setFilter(target.value)}
                  onFocus={() => {
                    if (!disabled) {
                      setFilter("");
                      setShowOptions(true);
                      setIsFocused(true);
                    }
                  }}
                  onBlur={() => {
                    handleInputFilterBlur();
                    setIsFocused(false);
                  }}
                  placeholder=" "
                  disabled={disabled}
                  readOnly={keyboardDisabled}
                  className={cn(
                    "outline-none peer w-full h-14 rounded-2xl bg-transparent text-base px-4 font-normal text-zinc-600 disabled:opacity-50 bg-gray-200 pt-2 appearance-none",
                    { "border-red-400": fieldState.invalid }
                  )}
                />
                <FaChevronDown
                  className={cn(
                    "absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600",
                    {
                      "rotate-180": showOptions,
                    }
                  )}
                />
              </div>

              <label
                htmlFor={`autocomplete-${name}-input-filter`}
                className="absolute text-xs text-gray-400 px-1 py-0 transition-all duration-200 transform origin-top-left peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-xs peer-focus:text-sky-700"
                style={{
                  top: filter || field.value || isFocused ? "5px" : "40%",
                  left: "10px",
                  fontSize:
                    filter || field.value || isFocused ? "12px" : "16px",
                  color: labelColor, // Color updated based on conditions
                }}
              >
                {label}
              </label>

              {showOptions && (
                <div
                  className={`absolute w-full bg-white shadow-lg mt-1 rounded-md max-h-60 overflow-y-auto z-10 ${
                    positionOptionBox === "top" ? "bottom-full" : "top-full"
                  }`}
                >
                  {filteredOptions.length === 0 && emptyOption ? (
                    <div className="p-2 text-center text-gray-500">
                      {emptyOption}
                    </div>
                  ) : (
                    filteredOptions.map((option) => (
                      <div
                        key={`${option.value}-${option.label}`}
                        id={`autocompleteoption-${name}-${option.value}`}
                        onClick={() => {
                          setSelectedOption(option);
                          setFilter(option.label);
                          setShowOptions(false);
                          field.onChange(option.value);
                          if (onChange) {
                            onChange(option.value);
                          }
                        }}
                        className="flex items-center py-2 px-4 cursor-pointer hover:bg-gray-100"
                      >
                        {option.label}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {fieldState.invalid && (
              <ErrorMessage
                field={name}
                errorMessage={fieldState.error?.message || ""}
              />
            )}
          </div>
        </div>
      )}
    />
  );
}
