/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ButtonLoader } from "@/components/ButtonLoader";
import { Input } from "@/components/Form/Input";
import { Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormRoot } from "@/components/Form/FormRoot";

const addressSchema = z.object({
  cep: z.string().nonempty("Campo obrigatório").min(9, "Mínimo 8 caracteres"),
  street: z.string().nonempty("Campo obrigatório"),
  number: z.string().nonempty("Campo obrigatório"),
  city: z.string().nonempty("Campo obrigatório"),
  state: z.string().nonempty("Campo obrigatório"),
  cnpj: z.string().optional(),
});

type AddressData = z.infer<typeof addressSchema>;

interface Props {
  nextStep: () => void;
  prevStep: () => void;
}

export function Address({ nextStep, prevStep }: Props) {
  const [formDisabled, setFormDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const form = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
  });
  const cep = form.watch("cep");

  useEffect(() => {
    async function fetchAddress() {
      if (cep && cep.length === 9) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          const data = await response.json();

          if (data.erro) {
            console.error("CEP inválido!");
            return;
          }

          form.setValue("street", data.logradouro || "");
          form.setValue("city", data.localidade || "");
          form.setValue("state", data.uf || "");
          setFormDisabled(false);
        } catch (error) {
          console.error("Erro ao buscar CEP:", error);
        }
      }
    }

    fetchAddress();
  }, [cep, form]);

  const onSubmit = async (data: AddressData) => {
    try {
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
          <div className="w-full flex items-center gap-2">
            <Input type="text" label="CEP" name="cep" mask="cep" />

            <Link
              to={"/"}
              className="min-w-24 underline text-sky-700 hover:opacity-80"
            >
              Esqueci o CEP
            </Link>
          </div>

          <div className="w-full flex items-center gap-2">
            <Input
              type="text"
              label="Rua"
              name="street"
              disabled={formDisabled}
            />

            <span className="w-28">
              <Input
                type="text"
                label="Nº"
                name="number"
                mask="onlyNumbers"
                disabled={formDisabled}
              />
            </span>
          </div>

          <div className="w-full flex items-center gap-2">
            <Input
              type="text"
              label="Cidade"
              name="city"
              disabled={formDisabled}
            />

            <span className="w-64">
              <Input
                type="text"
                label="Estado"
                name="state"
                disabled={formDisabled}
              />
            </span>
          </div>

          <Input
            type="text"
            label="Complemento"
            name="complement"
            errorMessage={error}
            disabled={formDisabled}
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
    </>
  );
}
