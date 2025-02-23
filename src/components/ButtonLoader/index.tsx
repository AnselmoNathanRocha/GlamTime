import { ComponentProps } from "react";
import { Loader } from "../Loader";
import { cn } from "@/utils/functions";

type Props = ComponentProps<"button"> & {
  loading?: boolean;
  variant?: "primary" | "secondary";
};

export function ButtonLoader({
  variant = "primary",
  loading,
  className,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        "w-full h-14 rounded-2xl flex justify-center items-center self-center gap-2 font-semibold text-lg",
        {
          "bg-sky-700 hover:opacity-90 text-gray-100 shadow-3xl":
            variant === "primary",
          "bg-neutral-300 hover:bg-zinc-300 text-gray-400":
            variant === "secondary",
        },
        className
      )}
      {...props}
    >
      {loading ? <Loader variant="secondary" /> : props.children}
    </button>
  );
}