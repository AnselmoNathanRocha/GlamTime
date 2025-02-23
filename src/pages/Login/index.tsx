/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/Form/Input";
import { InputPass } from "@/components/Form/InputPass";
import { useState } from "react";
import { AuthResponse, authService } from "@/services/auth-service";
import { useAuth } from "@/contexts/auth";
import { FormRoot } from "@/components/Form/FormRoot";
import { ButtonLoader } from "@/components/ButtonLoader";
import { Logo } from "@/components/Logo";
import { Link } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import { FaFacebook } from "react-icons/fa";

const loginSchema = z.object({
  email: z.string().email("Email inválido").nonempty("Email obrigatório"),
  password: z
    .string()
    .min(6, "Mínimo 6 caracteres")
    .nonempty("Senha obrigatória"),
});

type LoginData = z.infer<typeof loginSchema>;

export function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });
  const { login } = useAuth();

  const onSubmit = async (data: LoginData) => {
    try {
      setError("");
      setLoading(true);
      const response: AuthResponse = await authService.authenticate(data);

      login(response.token, response.expiresAt);
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
    <div className="w-full h-screen p-5 pb-20 flex flex-col justify-center">
      <div className="w-full flex flex-col justify-center items-center gap-10 my-8">
        <Logo />

        <p className="w-56 text-center text-xl font-semibold text-gray-600">
          Acesse o sistema de agendamento.
        </p>
      </div>

      <FormRoot form={form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="w-full flex flex-col gap-2">
          <Input type="email" label="Email" name="email" />

          <InputPass
            id="password"
            label="Senha"
            name="password"
            errorMessage={error}
          />
        </div>

        <ButtonLoader loading={loading} className="mt-3">
          Acessar
        </ButtonLoader>

        <div className="text-sky-700 hover:opacity-90 mt-4 flex justify-center items-center gap-1">
          <Link to={"/"} className="text-sm">
            Esqueci minha senha
          </Link>

          <FaChevronRight size={10} />
        </div>

        <div className="w-full relative flex flex-col justify-center items-center my-6">
          <span className="w-full flex border border-solid border-gray-200" />
          <p className="text-sm text-gray-500 px-4 bg-gray-50 absolute">ou</p>
        </div>

        <GoogleLogin
          onSuccess={(response) => {
            console.log("Google Login Success: ", response);
          }}
          onError={() => {
            console.log("Login with Google failed");
          }}
          useOneTap
          theme="outline"
          shape="circle"
        />

        <div className="w-full h-10 mt-2 rounded-full border bg-white border-solid border-gray-300 flex justify-center items-center relative cursor-pointer hover:border-blue-200">
          <FaFacebook className="text-blue-700 text-2xl absolute left-2" />
          <p className="text-sm font-medium text-gray-700">
            Iniciar sessão com o Facebook
          </p>
        </div>
      </FormRoot>
    </div>
  );
}
