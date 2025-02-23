/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosError } from "axios";
import dayjs from "dayjs";
import { ZodError } from "zod";
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const serviceTypeOptions = [
  { value: "LABORER", label: "Operário" },
  { value: "BRICKLAYER", label: "Pedreiro" },
  { value: "CARPENTER", label: "Carpinteiro" },
  { value: "IRONWORKER", label: "Ferreiro" },
  { value: "BUILDING_TECHNICIAN", label: "Técnico de Construção" },
  { value: "FOREMAN", label: "Encarregado" },
  { value: "CONSTRUCTION_MASTER", label: "Mestre de Construção" },
  { value: "ENGINEER", label: "Engenheiro" },
  { value: "PRODUCTION", label: "Produção" },
  { value: "DAILY", label: "Diária" },
  { value: "MONTHLY", label: "Mensal" },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
export function extractDeepPropertyByMapKey(item: any, property: string) {
  const keys = property.split(".");
  return keys.reduce(
    (xs, x) => (xs && (xs[x] !== null || xs[x] !== undefined) ? xs[x] : null),
    item
  );
}

export function keepOnlyNumbers(text: string) {
  return text.replace(/\D/g, "");
}

export function extractZodErrors<T>(zodError: ZodError) {
  return zodError.errors.reduce((prev, actual) => {
    const [name] = actual.path;
    const error = actual.message;
    prev[String(name)] = error;
    return prev;
  }, {} as Record<string, any>) as T;
}

export function validateCNPJ(cnpj: string) {
  const cnpjDigitsOnly = cnpj.replace(/[^\d]/g, "");

  const CNPJ_LENGTH = 14;
  if (cnpjDigitsOnly.length !== CNPJ_LENGTH) {
    return false;
  }

  const ALL_SAME_DIGITS_REGEX = /^(\d)\1+$/;
  if (ALL_SAME_DIGITS_REGEX.test(cnpjDigitsOnly)) {
    return false;
  }

  const FIRST_DIGIT_POSITION = 12;
  const SECOND_DIGIT_POSITION = 13;
  const MULTIPLIERS_FOR_FIRST_DIGIT = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < FIRST_DIGIT_POSITION; i++) {
    sum += parseInt(cnpjDigitsOnly[i]) * MULTIPLIERS_FOR_FIRST_DIGIT[i];
  }
  const firstDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (parseInt(cnpjDigitsOnly[FIRST_DIGIT_POSITION]) !== firstDigit) {
    return false;
  }

  const MULTIPLIERS_FOR_SECOND_DIGIT = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < SECOND_DIGIT_POSITION; i++) {
    sum += parseInt(cnpjDigitsOnly[i]) * MULTIPLIERS_FOR_SECOND_DIGIT[i];
  }
  const secondDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (parseInt(cnpjDigitsOnly[SECOND_DIGIT_POSITION]) !== secondDigit) {
    return false;
  }

  return true;
}

export function validateCPF(cpf: string) {
  const cpfDigitsOnly = cpf.replace(/[^\d]/g, "");

  const CPF_LENGTH = 11;
  if (cpfDigitsOnly.length !== CPF_LENGTH) {
    return false;
  }

  const ALL_SAME_DIGITS_REGEX = /^(\d)\1+$/;
  if (ALL_SAME_DIGITS_REGEX.test(cpfDigitsOnly)) {
    return false;
  }

  let sum = 0;
  const MULTIPLIERS_FIRST_DIGIT = [10, 9, 8, 7, 6, 5, 4, 3, 2];
  const MULTIPLIERS_SECOND_DIGIT = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];

  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpfDigitsOnly[i]) * MULTIPLIERS_FIRST_DIGIT[i];
  }
  let firstDigit = (sum * 10) % 11;
  if (firstDigit === 10) {
    firstDigit = 0;
  }
  if (parseInt(cpfDigitsOnly[9]) !== firstDigit) {
    return false;
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpfDigitsOnly[i]) * MULTIPLIERS_SECOND_DIGIT[i];
  }
  let secondDigit = (sum * 10) % 11;
  if (secondDigit === 10) {
    secondDigit = 0;
  }
  if (parseInt(cpfDigitsOnly[10]) !== secondDigit) {
    return false;
  }

  return true;
}

export function validateCPFOrCNPJ(document: string): boolean {
  const digitsOnly = document.replace(/[^\d]/g, "");

  const CPF_LENGTH = 11;
  const CNPJ_LENGTH = 14;

  if (digitsOnly.length === CPF_LENGTH) {
    return validateCPF(digitsOnly);
  } else if (digitsOnly.length === CNPJ_LENGTH) {
    return validateCNPJ(digitsOnly);
  } else {
    return false;
  }
}

export function calculatePageNumbersToShow(
  maxVisibleButtons: number,
  totalPages: number,
  actualPage: number
) {
  let maxLeft = actualPage - Math.floor(maxVisibleButtons / 2);
  let maxRight = totalPages + Math.floor(maxVisibleButtons / 2);

  if (maxLeft < 1) {
    maxLeft = 1;
    maxRight = maxVisibleButtons;
  }

  maxRight = maxLeft + (maxVisibleButtons - 1);

  if (maxRight > totalPages) {
    maxRight = totalPages;
    maxLeft = Math.max(totalPages - maxVisibleButtons + 1, 1);
  }

  return {
    maxLeft: maxLeft,
    maxRight: maxRight,
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

export function formatNumber(
  value: number,
  minimumFractionDigits?: number,
  maximumFractionDigits?: number
) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: minimumFractionDigits ?? 0,
    maximumFractionDigits: maximumFractionDigits ?? 3,
  }).format(value);
}

export const noOp: () => void = () => null;

export function convertToNumber(text?: string | number): number {
  if (!text) {
    return 0;
  }

  const numberValue = Number(
    String(text).replaceAll(".", "").replace(",", ".")
  );
  return isNaN(numberValue) ? 0 : numberValue;
}

export function onlyFirstLetterCapitalized(text: string) {
  return text.charAt(0).toUpperCase() + text.toLowerCase().slice(1);
}

export function removeFalsyProperties(obj: Record<string, any>) {
  return Object.entries(obj)
    .filter(([_, value]) => Boolean(value))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, any>);
}

export function extractMessageFromAxiosErrorOrDefault(
  error: any,
  defaultMessage: string
) {
  if (error instanceof AxiosError && error.response?.data) {
    return error.response.data.error;
  }

  return defaultMessage;
}

export const formatDate = (date: string) => {
  return dayjs(date).format("DD/MM/YYYY");
};

export function formatDateAndHours(date: string) {
  return dayjs(date).format("DD/MM/YYYY [às] HH:mm");
}

export function formatCNPJ(value: string) {
  const strValue = value.toString().padStart(14, "0");

  const formattedCNPJ = strValue.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );

  return formattedCNPJ;
}

export const todayDate = () => {
  const now = dayjs();
  const brasiliaTime = now.utcOffset(-3);
  return brasiliaTime.format("YYYY-MM-DD");
};

export function getMonthsDifference(date1: string, date2: string): number {
  const [day1, month1, year1] = date1.split("/").map(Number);
  const [day2, month2, year2] = date2.split("/").map(Number);

  const startDate = new Date(year1, month1 - 1, day1);
  const endDate = new Date(year2, month2 - 1, day2);

  const yearsDifference = endDate.getFullYear() - startDate.getFullYear();
  const monthsDifference = endDate.getMonth() - startDate.getMonth();

  return yearsDifference * 12 + monthsDifference;
}

export function translate(serviceType: string) {
  const option = serviceTypeOptions.find((opt) => opt.value === serviceType);
  return option ? option.label : serviceType;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
