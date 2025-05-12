import { useRef } from "react";
import DatePicker from "react-datepicker";
import formatDate from "utils/formatDate";
import "react-datepicker/dist/react-datepicker.css";


interface DatePickerItemProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}
export const DatePickerItem = ({
  selectedDate,
  setSelectedDate,
}: DatePickerItemProps) => {
  const ref = useRef<DatePicker>(null);
  const formattedDate = formatDate(selectedDate);
  const handleClick = () => {
    ref.current?.setOpen(true);
  };
  return (
    <div
      className="bg-neutral-100 px-5 h-10 font-bold flex text-sm items-center gap-2 rounded-lg"
      onClick={handleClick}
    >
      <span>{formattedDate}</span>
      <DatePicker
        ref={ref}
        selected={selectedDate}
        onChange={(date: Date | null) => {
          if (date) {
            setSelectedDate(date);
          }
        }}
        dateFormat="(d MMM yyyy)"
        placeholderText="Select date"
        className="bg-neutral-100 outline-none"
      />
    </div>
  );
};
