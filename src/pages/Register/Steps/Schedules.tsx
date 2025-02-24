import { ButtonLoader } from "@/components/ButtonLoader";
import { FormRoot } from "@/components/Form/FormRoot";
import { Input } from "@/components/Form/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion } from "framer-motion";
import { FaRegCircle } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const schedulesSchema = z.object({
  operatingDays: z
    .array(
      z.object({
        day: z.string().optional(),
        operatingHours: z.object({
          open: z.string().min(1, "Hora de abertura é obrigatória"),
          close: z.string().min(1, "Hora de fechamento é obrigatória"),
        }),
      })
    )
    .min(1, "Selecione pelo menos um dia"),
});

type SchedulesData = z.infer<typeof schedulesSchema>;

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

export function Schedules({ nextStep, prevStep }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [operatingDays, setOperatingDays] = useState<
    { day: string; operatingHours: { open: string; close: string } }[]
  >([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const form = useForm<SchedulesData>({
    resolver: zodResolver(schedulesSchema),
    defaultValues: {
      operatingDays: [],
    },
  });

  useEffect(() => {
    form.reset({ operatingDays });
  }, [operatingDays, form]);

  const watchedOperatingDays = form.watch("operatingDays");

  const onSubmit = async (data: SchedulesData) => {
    try {
      setError("");
      setLoading(true);

      const storedData = localStorage.getItem("data");
      const parsedData = storedData ? JSON.parse(storedData) : {};
      const updatedData = { ...parsedData, ...data };
      localStorage.setItem("data", JSON.stringify(updatedData));

      const newStoredData = localStorage.getItem("data");
      console.log("Data: ", newStoredData);
    
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

  useEffect(() => {
    const getData = async () => {
      const storedData = localStorage.getItem("data");
      const parsedData = storedData ? JSON.parse(storedData) : {};
      const storedOperatingDays = parsedData.operatingDays || [];
      setOperatingDays(storedOperatingDays);

      if (storedOperatingDays.length > 0) {
        setOpenDropdown(storedOperatingDays[0].day);
      }
    };

    getData();
  }, []);

  const handleNextItem = (currentIndex: number) => {
    setTimeout(() => {
      if (currentIndex < operatingDays.length - 1) {
        setOpenDropdown(operatingDays[currentIndex + 1].day);
      } else {
        setOpenDropdown(null);
      }
    }, 300);
  };

  const handleToggleDropdown = (day: string) => {
    setOpenDropdown(openDropdown === day ? null : day);
  };

  const translateDayAbbreviation = (day: string, full: boolean = false) => {
    const daysTranslation: Record<string, string> = {
      sunday: "Domingo",
      monday: "Segunda-feira",
      tuesday: "Terça-feira",
      wednesday: "Quarta-feira",
      thursday: "Quinta-feira",
      friday: "Sexta-feira",
      saturday: "Sábado",
    };

    const abbreviatedDays: Record<string, string> = {
      sunday: "Dom",
      monday: "Seg",
      tuesday: "Ter",
      wednesday: "Qua",
      thursday: "Qui",
      friday: "Sex",
      saturday: "Sáb",
    };

    return full
      ? daysTranslation[day.toLowerCase()] || day
      : abbreviatedDays[day.toLowerCase()] || day;
  };

  return (
    <FormRoot
      form={form}
      onSubmit={form.handleSubmit(onSubmit, (err) =>
        console.log("Error: ", err)
      )}
    >
      <div className="w-full flex flex-col gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-500">
            Dias de operação
          </label>
          <div className="space-y-2">
            {operatingDays.map((item, index) => {
              const isFilled =
                watchedOperatingDays &&
                watchedOperatingDays[index]?.operatingHours.open &&
                watchedOperatingDays[index]?.operatingHours.close?.length === 5;

              return (
                <div key={item.day}>
                  <button
                    type="button"
                    onClick={() => handleToggleDropdown(item.day)}
                    className="w-full flex justify-between items-center bg-gray-200 p-2 rounded"
                  >
                    <span>{translateDayAbbreviation(item.day, true)}</span>
                    {isFilled ? (
                      <IoMdCheckmarkCircleOutline className="text-xl text-sky-700" />
                    ) : (
                      <FaRegCircle className="text-base text-sky-700" />
                    )}
                  </button>
                  {openDropdown === item.day && (
                    <motion.div
                      initial={{ maxHeight: 0, opacity: 0 }}
                      animate={{ maxHeight: 500, opacity: 1 }}
                      exit={{ maxHeight: 0, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      style={{ overflow: "hidden", visibility: "visible" }}
                    >
                      <div className="mt-2 space-y-2">
                        <div className="flex gap-4">
                          <Input
                            type="time"
                            label={`Abertura (${translateDayAbbreviation(
                              item.day
                            )})`}
                            name={`operatingDays[${index}].operatingHours.open`}
                            defaultValue={item.operatingHours.open}
                          />
                          <Input
                            type="time"
                            label={`Fechamento (${translateDayAbbreviation(
                              item.day
                            )})`}
                            name={`operatingDays[${index}].operatingHours.close`}
                            defaultValue={item.operatingHours.close}
                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                              if (e.target.value.length === 5) {
                                handleNextItem(index);
                              }
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-sm font-medium text-red-400">{error}</p>
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
