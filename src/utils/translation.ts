export interface MonthlyData {
  [month: string]: {
    totalExpectedValue: number;
    totalSpentValue: number;
  };
}

export const translateMonths = (monthlyData: MonthlyData): MonthlyData => {
  const monthTranslation: { [key: string]: string } = {
    JANUARY: "Janeiro",
    FEBRUARY: "Fevereiro",
    MARCH: "Março",
    APRIL: "Abril",
    MAY: "Maio",
    JUNE: "Junho",
    JULY: "Julho",
    AUGUST: "Agosto",
    SEPTEMBER: "Setembro",
    OCTOBER: "Outubro",
    NOVEMBER: "Novembro",
    DECEMBER: "Dezembro",
  };

  const translatedData: MonthlyData = {};

  Object.keys(monthlyData).forEach((month) => {
    if (monthlyData.hasOwnProperty(month)) {
      const translatedMonth = monthTranslation[month];
      translatedData[translatedMonth] = monthlyData[month];
    }
  });

  return translatedData;
};
