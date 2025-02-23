import { FormEvent } from "react";
import { keepOnlyNumbers } from "./functions";

const CPF_LENGTH = 11;

function cnpj(event: FormEvent<HTMLInputElement> | string) {
  if (typeof event === "string") {
    return apply(event);
  }

  function apply(value: string) {
    if (!value.match(/^(\d{2}).(\d{3}).(\d{3})\/(\d{4})-(\d{2})$/)) {
      value = value.replace(/\D/g, "");
      value = value.replace(/(\d{2})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1/$2");
      value = value.replace(/(\d{4})(\d{2})\d*$/, "$1-$2");
    }

    return value;
  }

  event.currentTarget.maxLength = 18;
  event.currentTarget.pattern = "\\d{2}\\.\\d{3}\\.\\d{3}\\/\\d{4}-\\d{2}";
  event.currentTarget.value = apply(event.currentTarget.value);
  return event;
}

function cpf(event: FormEvent<HTMLInputElement> | string) {
  if (typeof event === "string") {
    return apply(event);
  }

  function apply(value: string) {
    if (!value.match(/^(\d{3}).(\d{3}).(\d{3})-(\d{2})$/)) {
      value = value.replace(/\D/g, "");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d)/, "$1.$2");
      value = value.replace(/(\d{3})(\d{2})\d*$/, "$1-$2");
    }

    return value;
  }

  event.currentTarget.maxLength = 14;
  event.currentTarget.pattern = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}";
  event.currentTarget.value = apply(event.currentTarget.value);
  return event;
}

function cpfOrCnpj(event: FormEvent<HTMLInputElement> | string) {
  const actualValue =
    typeof event === "string" ? event : event.currentTarget.value;

  if (!actualValue) {
    return event;
  }

  const maskedEvent =
    keepOnlyNumbers(actualValue).length > CPF_LENGTH ? cnpj(event) : cpf(event);

  if (typeof maskedEvent !== "string") {
    maskedEvent.currentTarget.maxLength = 18;
  }

  return maskedEvent;
}

function phone(event: FormEvent<HTMLInputElement> | string) {
  if (typeof event === "string") {
    return apply(event);
  }

  function apply(value: string) {
    if (!value.match(/^\((\d{2})\)[ ](\d{5})-(\d{4})/)) {
      value = value.replace(/\D/g, "");
      value = value.replace(/(\d{2})(\d)/, "($1) $2");
      value = value.replace(/(\d{5})(\d{4})\d*$/, "$1-$2");
    }

    return value;
  }

  event.currentTarget.maxLength = 15;
  event.currentTarget.pattern = "\\(\\d{2}\\)\\s\\d{5}-\\d{4}";
  event.currentTarget.value = apply(event.currentTarget.value);
  return event;
}

function decimalTwoPlaces(
  event: FormEvent<HTMLInputElement> | string | number
) {
  function apply(value: string | number) {
    if (!value) {
      return "";
    }

    return value
      .toString()
      .replace(/[^0-9,]/g, "")
      .padStart(3, "0")
      .replace(/(\d),*(\d{2})$/, "$1,$2")
      .replace(/,(?=.*?,)/g, "")
      .replace(/^0*([0-9])/, "$1")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }

  if (typeof event === "string" || typeof event === "number") {
    return apply(event);
  }

  const value = event.currentTarget.value;
  event.currentTarget.value = apply(value);
  return event;
}

function decimalThreePlaces(
  event: FormEvent<HTMLInputElement> | string | number
) {
  function apply(value: string | number) {
    if (!value) {
      return "";
    }

    return value
      .toString()
      .replace(/[^0-9,]/g, "")
      .padStart(4, "0")
      .replace(/(\d),*(\d{3})$/, "$1,$2")
      .replace(/,(?=.*?,)/g, "")
      .replace(/^0*([0-9])/, "$1")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }

  if (typeof event === "string" || typeof event === "number") {
    return apply(event);
  }

  const value = event.currentTarget.value;
  event.currentTarget.value = apply(value);
  return event;
}

function onlyNumbers(event: FormEvent<HTMLInputElement> | string) {
  function apply(value: string) {
    return value.replace(/\D/g, "");
  }

  if (typeof event === "string") {
    return apply(event);
  }

  const value = event.currentTarget.value;
  event.currentTarget.value = apply(value);
  return event;
}

function onlyNumbersAndComma(event: FormEvent<HTMLInputElement> | string) {
  function apply(value: string) {
    return value.replace(/[^0-9,]/g, "");
  }

  if (typeof event === "string") {
    return apply(event);
  }

  const value = event.currentTarget.value;
  event.currentTarget.value = apply(value);
  return event;
}

function card(event: FormEvent<HTMLInputElement> | string) {
  function apply(value: string) {
    const onlyDigits = value.replace(/\D/g, "");
    const limitedDigits = onlyDigits.slice(0, 16);
    const formattedValue = limitedDigits.replace(/(\d{4})(?=\d)/g, "$1 ");

    return formattedValue;
  }

  if (typeof event === "string") {
    return apply(event);
  }

  const value = event.currentTarget.value;
  event.currentTarget.value = apply(value);
  return event;
}

function capitalize(event: FormEvent<HTMLInputElement> | string) {
  function apply(value: string): string {
    return value
      .split(" ")
      .map((word) =>
        word.length > 0
          ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          : word
      )
      .join(" ");
  }

  if (typeof event === "string") {
    return apply(event);
  }

  const value = event.currentTarget.value;
  const newValue = apply(value);
  event.currentTarget.value = newValue;
  return event;
}

export const masks = {
  cnpj,
  cpf,
  cpfOrCnpj,
  phone,
  decimalTwoPlaces,
  decimalThreePlaces,
  onlyNumbers,
  onlyNumbersAndComma,
  card,
  capitalize
};

export type MaskType = keyof typeof masks;
