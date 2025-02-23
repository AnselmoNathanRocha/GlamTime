import { useFormContext } from "react-hook-form";

interface ErrorMessageProps {
  field: string;
  errorMessage?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function get(obj: Record<any, any>, path: string) {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce(
        (res, key) => (res !== null && res !== undefined ? res[key] : res),
        obj,
      );

  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);

  return result;
}

export function ErrorMessage({ field, errorMessage }: ErrorMessageProps) {
  const formContext = useFormContext();
  if (!formContext) return <p className="text-xs font-normal text-red-600 text-start mx-1">{errorMessage}</p>;

  const {
    formState: { errors },
  } = formContext;

  const message = errorMessage || get(errors, field)?.message?.toString();

  if (!message) {
    return null;
  }

  return <p className="text-xs font-normal text-red-600 text-start mx-1">{message}</p>;
}
