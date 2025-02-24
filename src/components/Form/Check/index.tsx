interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Check({ checked, onChange, ...props }: Props) {
  return (
    <div className="relative cursor-pointer">
      <label
        htmlFor="checkbox"
        className="cursor-pointer relative flex size-4.5 items-center justify-center overflow-hidden rounded-full bg-sky-700 p-[2px] duration-100 hover:p-[3px]"
      >
        <input
          {...props}
          type="checkbox"
          className="peer hidden"
          id="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="size-full rounded-full bg-white peer-checked:size-0"></span>
        <div className="absolute left-[3px] h-[1.5px] w-[6.5px] -translate-y-3 translate-x-3 rotate-[-41deg] rounded-sm bg-white duration-300 peer-checked:translate-x-1 peer-checked:translate-y-[1px]"></div>
        <div className="absolute left-[3.5px] top-[6px] h-[1.5px] w-[4px] -translate-x-3 -translate-y-3 rotate-[45deg] rounded-sm bg-white duration-300 peer-checked:translate-x-[1px] peer-checked:translate-y-1"></div>
      </label>
    </div>
  );
}
