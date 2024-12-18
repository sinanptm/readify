'use client';

import { parseISO, format } from 'date-fns';

interface DateFormatterProps {
  dateString: string;
}

export default function DateFormatter({ dateString }: DateFormatterProps) {
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>;
}