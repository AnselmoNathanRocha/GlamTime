import { useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "@/components/Logo";
import { Administrator } from "./Steps/Administrator";
import { Establishment } from "./Steps/Establishment";
import { Address } from "./Steps/Address";
import { Schedules } from "./Steps/Schedules";
import { OperatingDay } from "./Steps/OperatingDay";

export function Register() {
  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(1);
  const [cnpjDisabled, setCnpjDisabled] = useState<boolean>(false);

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  return (
    <div className="w-full h-screen p-5 pb-20 flex flex-col justify-center">
      <div className="w-full flex flex-col justify-center items-center gap-10 my-8">
        <Logo />
        <p className="w-60 text-center text-xl font-semibold text-gray-600">
          {step === 1 && "Cadastre-se para acessar o sistema de agendamento."}
          {step === 2 && "Cadastre um estabelecimento."}
          {step === 3 && "Adicione o endereço do estabelecimento."}
          {step === 4 && "Defina os dias de funcionamento."}
          {step === 5 && "Defina os horários de funcionamento."}
        </p>
      </div>

      <motion.div
        key={step}
        initial={{ x: direction * 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: direction * -100, opacity: 0 }}
        transition={{ duration: 0.1, ease: "linear" }}
      >
        {step === 1 && <Administrator nextStep={nextStep} />}
        {step === 2 && (
          <Establishment
            prevStep={prevStep}
            nextStep={nextStep}
            cnpjDisabled={cnpjDisabled}
            onChangeCheck={() => setCnpjDisabled(!cnpjDisabled)}
          />
        )}
        {step === 3 && <Address prevStep={prevStep} nextStep={nextStep} />}
        {step === 4 && <OperatingDay prevStep={prevStep} nextStep={nextStep} />}
        {step === 5 && <Schedules prevStep={prevStep} nextStep={nextStep} />}
        {step === 6 && (
          <p className="text-base text-gray-800 text-center">
            Conta criada com sucesso!
          </p>
        )}
      </motion.div>
    </div>
  );
}
 