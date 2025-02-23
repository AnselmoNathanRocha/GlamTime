import { FaRegClock } from "react-icons/fa";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-12 h-12 rounded-4xl rounded-tl-lg flex items-center justify-center bg-sky-700 text-white">
        <FaRegClock className="text-4xl" />
      </div>

      <h1 className="text-4xl font-semibold text-sky-700 tracking-tight">
        Glam
        <span className="text-gray-800 font-medium">Time</span>
      </h1>
    </div>
  );
}
