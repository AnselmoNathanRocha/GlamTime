import { useState } from "react";
import { PiEyeBold, PiEyeClosedBold } from "react-icons/pi";
import { Input, InputProps } from "../Input";

type InputPassProps = Omit<InputProps, "rightIcon" | "type">;

export function InputPass({ ...props }: InputPassProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <Input
      {...props}
      type={passwordVisible ? "text" : "password"}
      rightIcon={
        <i
        className="text-xl text-sky-700 hover:opacity-75 cursor-pointer"
          onClick={() => setPasswordVisible(!passwordVisible)}
        >
          {passwordVisible ? <PiEyeBold /> : <PiEyeClosedBold />}
        </i>
      }
    />
  );
}

