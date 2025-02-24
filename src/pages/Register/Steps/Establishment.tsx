/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonLoader } from "@/components/ButtonLoader";
import { AutoComplete } from "@/components/Form/AutoComplete";
import { Check } from "@/components/Form/Check";
import { FormRoot } from "@/components/Form/FormRoot";
import { Input } from "@/components/Form/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const establishmentSchema = z.object({
  establishment: z.string().nonempty("Campo obrigatório"),
  businessType: z.string().nonempty("Campo obrigatório"),
  cnpj: z.string().optional(),
});

type EstablishmentData = z.infer<typeof establishmentSchema>;

interface Props {
  nextStep: () => void;
  prevStep: () => void;
  cnpjDisabled: boolean;
  onChangeCheck: (checked: boolean) => void;
}

export function Establishment({
  nextStep,
  prevStep,
  cnpjDisabled,
  onChangeCheck,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const form = useForm<EstablishmentData>({
    resolver: zodResolver(establishmentSchema),
  });
  const cnpj = form.watch("cnpj");

  const onSubmit = async (data: EstablishmentData) => {
    try {
      if (
        (!cnpjDisabled && cnpj === undefined) ||
        (!cnpjDisabled && cnpj === null) ||
        (!cnpjDisabled && cnpj === "")
      ) {
        setError("Digite um CNPJ");
        return;
      }

      setError("");
      setLoading(true);

      const storedData = localStorage.getItem("data");
      const parsedData = storedData ? JSON.parse(storedData) : {};
      const updatedData = { ...parsedData, ...data };
      localStorage.setItem("data", JSON.stringify(updatedData));
      nextStep();
    } catch (error: any) {
      console.error(error);
      if (error.response.data.error) {
        setError(error.response.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormRoot form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-full flex flex-col gap-2">
          <Input type="text" label="Estabelecimento" name="establishment" />

          <AutoComplete
            name="businessType"
            label="Tipo de Negócio"
            options={[
              { label: "Nails Designer", value: "nailsDesigner" },
              { label: "Designer de Sobrancelhas", value: "eyebrowDesigner" },
              { label: "Cabeleireiro", value: "hairdresser" },
              { label: "Maquiagem", value: "makeupArtist" },
              { label: "Esteticista", value: "esthetician" },
              { label: "Barbearia", value: "barberShop" },
              { label: "Design de Cabelo", value: "hairDesign" },
            ]}
            keyboardDisabled={false}
            emptyOption={<>Sem resutados</>}
          />

          <div>
            <Input
              type="text"
              label="CNPJ"
              name="cnpj"
              mask="cnpj"
              errorMessage={error}
              disabled={cnpjDisabled}
            />

            <label className="flex items-center gap-1 pl-2 text-sm text-gray-500">
              <Check checked={cnpjDisabled} onChange={onChangeCheck} />
              Não possuo CNPJ
            </label>
          </div>
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
    </>
  );
}
