/* eslint-disable @typescript-eslint/no-explicit-any */
import { ButtonLoader } from "@/components/ButtonLoader";
import { FormRoot } from "@/components/Form/FormRoot";
import { Input } from "@/components/Form/Input";
import { InputPass } from "@/components/Form/InputPass";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const administratorSchema = z.object({
  name: z.string().nonempty("Nome obrigatório").min(3, "Mínimo 3 caracteres"),
  email: z.string().email("Email inválido").nonempty("Email obrigatório"),
  phone: z.string().nonempty("Telefone obrigatório"),
  password: z
    .string()
    .min(6, "Mínimo 6 caracteres")
    .nonempty("Senha obrigatória"),
});

type AdministratorData = z.infer<typeof administratorSchema>;

interface Props {
  nextStep: () => void;
}

export function Administrator({ nextStep }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const form = useForm<AdministratorData>({
    resolver: zodResolver(administratorSchema),
  });

  const onSubmit = async (data: AdministratorData) => {
    try {
      setError("");
      setLoading(true);

      localStorage.setItem("data", JSON.stringify(data));
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
    <FormRoot form={form} onSubmit={form.handleSubmit(onSubmit)}>
      <div className="w-full flex flex-col gap-2">
        <Input type="text" label="Nome" name="name" />

        <Input type="email" label="Email" name="email" />

        <Input type="text" label="Telefone" name="phone" mask="phone" />

        <InputPass
          id="password"
          label="Senha"
          name="password"
          errorMessage={error}
        />
      </div>

      <ButtonLoader loading={loading} className="mt-3">
        Próximo
      </ButtonLoader>

      <div className="text-sm mt-4 flex justify-center items-center gap-1">
        <p className="text-gray-500">Já possui uma conta?</p>

        <Link
          to={"/login"}
          className="text-sky-700 hover:opacity-80 hover:underline"
        >
          Entrar
        </Link>
      </div>
    </FormRoot>
  );
}
