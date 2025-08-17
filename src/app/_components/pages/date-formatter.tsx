import { parseISO, format } from "date-fns";

type Props = {
  dateString: string;
};

const DateFormatter = ({ dateString }: Props) => {
  if (!dateString) {
    return null;
  }

  try {
    const date = parseISO(dateString);
    return <time dateTime={dateString}>{format(date, "LLLL	d, yyyy")}</time>;
  } catch (error) {
    console.warn("Invalid date string:", dateString, error);
    return null;
  }
};

export default DateFormatter;
