import { format, isValid, parseISO } from 'date-fns';

export const hourToMilliSec = (hrs: number): number => hrs * 60 * 60 * 1000;

export const minuteToMilliSec = (min: number): number => min * 60 * 1000;

export const generateCopyrightNotice = (owner = 'Storebridger') => {
  const currentYear = new Date().getFullYear();
  return `Copyright © ${owner} ${currentYear}`;
};

export const calculateExpiryDate = (days: number): { expiryDate: Date; remainingDays: number } => {
  const currentDate: Date = new Date();
  const expiryDate: Date = new Date(currentDate.getTime() + days * 24 * 60 * 60 * 1000);
  const timeDifference: number = expiryDate.getTime() - currentDate.getTime();
  const remainingDays: number = Math.ceil(timeDifference / (24 * 60 * 60 * 1000));

  return { expiryDate, remainingDays };
};

interface FormatDateTimeInterface {
  type: 'Date' | 'Time' | 'DateTime';
  date?: string | Date;
  customFormat?: string;
}

export const formatDateTime = ({ type, date, customFormat }: FormatDateTimeInterface) => {
  let parsedDate;

  if (typeof date === 'string') {
    parsedDate = parseISO(date);
  } else if (date instanceof Date) {
    parsedDate = date;
  } else {
    parsedDate = new Date(); // or handle the case when date is undefined
  }
  const isDateValid = isValid(parsedDate);
  const defaultFormats = {
    Time: 'h:mm a',
    Date: 'MMMM dd, yyyy',
    DateTime: 'MMMM dd, yyyy h:mm a',
  };
  const formatDate = customFormat || defaultFormats[type];

  return isDateValid ? format(parsedDate, formatDate) : format(new Date(), formatDate);
};

export const dateToISOString = (date: string | Date) => {
  return new Date(date).toISOString();
};
