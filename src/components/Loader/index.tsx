import { cn } from "@/utils/functions";
import { ComponentProps } from "react";

type Props = ComponentProps<"div"> & {
  variant?: "primary" | "secondary";
};

export function Loader({
  variant = "primary",
  className,
  ...props
}: Props) {
  return (
    <div className="size-full flex justify-center items-center">
      <div
        className={cn(
          "rounded-full border-[3px] border-solid border-transparent animate-spin self-center",
          {
            "size-16 border-t-green-600 border-l-green-600": variant === "primary",
            "size-8 border-t-gray-200 border-l-gray-200": variant === "secondary",
          },
          className
        )}
        {...props}
      />
    </div>
  );
}
