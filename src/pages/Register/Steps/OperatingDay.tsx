import { ButtonLoader } from "@/components/ButtonLoader";
import { CheckGroup } from "@/components/Form/Check/CheckGroup";
import { FormRoot } from "@/components/Form/FormRoot";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/Form/Input";
import { z } from "zod";
import { AutoComplete } from "@/components/Form/AutoComplete";

const operatingDaySchema = z.object({
  operatingDays: z.array(z.string()).min(1, "Selecione pelo menos um dia"),
  interval: z.string().nonempty("Campo obrigatório"),
  allowFits: z.boolean().refine((val) => typeof val === "boolean", {
    message: "Campo obrigatório",
  }),
  cancellationPolicy: z.string().nonempty("Campo obrigatório"),
});

type OperatingDayData = z.infer<typeof operatingDaySchema>;

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

const daysOfWeek = [
  { label: "Seg", value: "monday" },
  { label: "Ter", value: "tuesday" },
  { label: "Qua", value: "wednesday" },
  { label: "Qui", value: "thursday" },
  { label: "Sex", value: "friday" },
  { label: "Sab", value: "saturday" },
  { label: "Dom", value: "sunday" },
];

const intervalOptions = [
  { label: "10 minutos", value: "10" },
  { label: "15 minutos", value: "15" },
  { label: "30 minutos", value: "30" },
  { label: "45 minutos", value: "45" },
  { label: "60 minutos", value: "60" },
];

export function OperatingDay({ nextStep, prevStep }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<OperatingDayData>({
    resolver: zodResolver(operatingDaySchema),
  });

  const onSubmit = async (data: OperatingDayData) => {
    try {
      setError("");
      setLoading(true);

      const operatingDaysWithHours = data.operatingDays.map((day) => ({
        day,
        operatingHours: {
          open: "",
          close: "",
        },
      }));

      const storedData = localStorage.getItem("data");
      const parsedData = storedData ? JSON.parse(storedData) : {};
      const updatedData = { ...parsedData, operatingDays: operatingDaysWithHours };
      localStorage.setItem("data", JSON.stringify(updatedData));

      nextStep();
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormRoot form={form} onSubmit={form.handleSubmit(onSubmit)}>
      <div className="w-full flex flex-col gap-4">
        <CheckGroup
          name="operatingDays"
          label="Dias de Funcionamento"
          options={daysOfWeek}
        />

        <AutoComplete
          label="Intervalo entre atendimentos"
          name="interval"
          options={intervalOptions}
        />

        <CheckGroup
          name="allowFits"
          label="Permitir encaixes?"
          multiple={false}
          options={[
            { label: "Sim", value: true },
            { label: "Não", value: false },
          ]}
        />

        <Input
          type="text"
          label="Política de cancelamento"
          name="cancellationPolicy"
          errorMessage={error}
        />
      </div>

      <div className="w-full flex justify-between items-center gap-2">
        <ButtonLoader
          type="button"
          onClick={prevStep}
          className="mt-3 bg-neutral-300 text-white"
        >
          Anterior
        </ButtonLoader>

        <ButtonLoader loading={loading} className="mt-3">
          Próximo
        </ButtonLoader>
      </div>
    </FormRoot>
  );
}
