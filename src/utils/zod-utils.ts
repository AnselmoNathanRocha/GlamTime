import dayjs from "dayjs";
import { z } from "zod";

export const zodDateSchema = (outputFormat: string) =>
  z.coerce
    .date({
      errorMap: () => ({ message: "Campo obrigatório" }),
    })
    .transform((date) => dayjs.utc(date).format(outputFormat));

