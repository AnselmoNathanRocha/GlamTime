import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { Providers } from "./contexts";
import { Routes } from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

dayjs.locale("pt-br");
dayjs.extend(utc);
dayjs.extend(customParseFormat);

export function App() {
  return (
    <div className="size-full justify-center">
      <Providers>
        <Routes />
      </Providers>

      <ToastContainer theme="colored" position="bottom-center" />
    </div>
  );
}
