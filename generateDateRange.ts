export const generateDataRange = (startDate: Date, endDate: Date) => {
  const dateRange: Date[] = [];

  let currentDate = startDate;

  while (currentDate <= endDate) {
    dateRange.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateRange;
};
