"use client";
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { startOfWeek, endOfWeek, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfDay, endOfDay } from "date-fns";
import { toDate, formatInTimeZone } from "date-fns-tz";
import { DateRange } from "react-day-picker";
import { cva, VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "./ui/calendar";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const multiSelectVariants = cva(
  "flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium text-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground text-background",
        link: " underline-offset-4 hover:underline text-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface CalendarDatePickerProps extends React.HTMLAttributes<HTMLButtonElement>, VariantProps<typeof multiSelectVariants> {
  id?: string;
  className?: string;
  date: DateRange;
  closeOnSelect?: boolean;
  numberOfMonths?: 1 | 2;
  yearsRange?: number;
  onDateSelect: (range: { from: Date; to: Date }) => void;
}

export const CalendarDatePicker = React.forwardRef<HTMLButtonElement, CalendarDatePickerProps>(
  ({ id = "calendar-date-picker", className, date, closeOnSelect = false, numberOfMonths = 2, yearsRange = 10, onDateSelect, variant, ...props }, ref) => {
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [selectedRange, setSelectedRange] = React.useState<string | null>(numberOfMonths === 2 ? "This Year" : "Today");
    const [monthFrom, setMonthFrom] = React.useState<Date | undefined>(date?.from);
    const [yearFrom, setYearFrom] = React.useState<number | undefined>(date?.from?.getFullYear());
    const [monthTo, setMonthTo] = React.useState<Date | undefined>(numberOfMonths === 2 ? date?.to : date?.from);
    const [yearTo, setYearTo] = React.useState<number | undefined>(numberOfMonths === 2 ? date?.to?.getFullYear() : date?.from?.getFullYear());
    const [highlightedPart, setHighlightedPart] = React.useState<string | null>(null);

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const handleClose = () => setIsPopoverOpen(false);
    const handleTogglePopover = () => setIsPopoverOpen((prev) => !prev);

    const selectDateRange = (from: Date, to: Date, range: string) => {
      const startDate = startOfDay(toDate(from, { timeZone }));
      const endDate = numberOfMonths === 2 ? endOfDay(toDate(to, { timeZone })) : startDate;
      onDateSelect({ from: startDate, to: endDate });
      setSelectedRange(range);
      setMonthFrom(from);
      setYearFrom(from.getFullYear());
      setMonthTo(to);
      setYearTo(to.getFullYear());
      closeOnSelect && setIsPopoverOpen(false);
    };

    const handleDateSelect = (range: DateRange | undefined) => {
      if (range) {
        let from = startOfDay(toDate(range.from as Date, { timeZone }));
        let to = range.to ? endOfDay(toDate(range.to, { timeZone })) : from;
        if (numberOfMonths === 1) {
          if (range.from !== date.from) {
            to = from;
          } else {
            from = startOfDay(toDate(range.to as Date, { timeZone }));
          }
        }
        onDateSelect({ from, to });
        setMonthFrom(from);
        setYearFrom(from.getFullYear());
        setMonthTo(to);
        setYearTo(to.getFullYear());
      }
      setSelectedRange(null);
    };

    const handleMonthChange = (newMonthIndex: number, part: string) => {
      setSelectedRange(null);
      if (part === "from") {
        if (yearFrom !== undefined) {
          if (newMonthIndex < 0 || newMonthIndex > yearsRange + 1) return;
          const newMonth = new Date(yearFrom, newMonthIndex, 1);
          const from = numberOfMonths === 2 ? startOfMonth(toDate(newMonth, { timeZone })) : date?.from ? new Date(date.from.getFullYear(), newMonth.getMonth(), date.from.getDate()) : newMonth;
          const to = numberOfMonths === 2 ? (date.to ? endOfDay(toDate(date.to, { timeZone })) : endOfMonth(toDate(newMonth, { timeZone }))) : from;
          if (from <= to) {
            onDateSelect({ from, to });
            setMonthFrom(newMonth);
            setMonthTo(date.to);
          }
        }
      } else {
        if (yearTo !== undefined) {
          if (newMonthIndex < 0 || newMonthIndex > yearsRange + 1) return;
          const newMonth = new Date(yearTo, newMonthIndex, 1);
          const from = date.from ? startOfDay(toDate(date.from, { timeZone })) : startOfMonth(toDate(newMonth, { timeZone }));
          const to = numberOfMonths === 2 ? endOfMonth(toDate(newMonth, { timeZone })) : from;
          if (from <= to) {
            onDateSelect({ from, to });
            setMonthTo(newMonth);
            setMonthFrom(date.from);
          }
        }
      }
    };

    const handleYearChange = (newYear: number, part: string) => {
      setSelectedRange(null);
      if (part === "from") {
        if (years.includes(newYear)) {
          const newMonth = monthFrom ? new Date(newYear, monthFrom ? monthFrom.getMonth() : 0, 1) : new Date(newYear, 0, 1);
          const from = numberOfMonths === 2 ? startOfMonth(toDate(newMonth, { timeZone })) : date.from ? new Date(newYear, newMonth.getMonth(), date.from.getDate()) : newMonth;
          const to = numberOfMonths === 2 ? (date.to ? endOfDay(toDate(date.to, { timeZone })) : endOfMonth(toDate(newMonth, { timeZone }))) : from;
          if (from <= to) {
            onDateSelect({ from, to });
            setYearFrom(newYear);
            setMonthFrom(newMonth);
            setYearTo(date.to?.getFullYear());
            setMonthTo(date.to);
          }
        }
      } else {
        if (years.includes(newYear)) {
          const newMonth = monthTo ? new Date(newYear, monthTo.getMonth(), 1) : new Date(newYear, 0, 1);
          const from = date.from ? startOfDay(toDate(date.from, { timeZone })) : startOfMonth(toDate(newMonth, { timeZone }));
          const to = numberOfMonths === 2 ? endOfMonth(toDate(newMonth, { timeZone })) : from;
          if (from <= to) {
            onDateSelect({ from, to });
            setYearTo(newYear);
            setMonthTo(newMonth);
            setYearFrom(date.from?.getFullYear());
            setMonthFrom(date.from);
          }
        }
      }
    };

    const today = new Date();
    const years = Array.from({ length: yearsRange + 1 }, (_, i) => today.getFullYear() - yearsRange / 2 + i);

    const dateRanges = [
      { label: "Today", start: today, end: today },
      { label: "Yesterday", start: subDays(today, 1), end: subDays(today, 1) },
      {
        label: "This Week",
        start: startOfWeek(today, { weekStartsOn: 1 }),
        end: endOfWeek(today, { weekStartsOn: 1 }),
      },
      {
        label: "Last Week",
        start: subDays(startOfWeek(today, { weekStartsOn: 1 }), 7),
        end: subDays(endOfWeek(today, { weekStartsOn: 1 }), 7),
      },
      { label: "Last 7 Days", start: subDays(today, 6), end: today },
      {
        label: "This Month",
        start: startOfMonth(today),
        end: endOfMonth(today),
      },
      {
        label: "Last Month",
        start: startOfMonth(subDays(today, 1)),
        end: endOfMonth(subDays(today, 1)),
      },
      { label: "This Year", start: startOfYear(today), end: endOfYear(today) },
      {
        label: "Last Year",
        start: startOfYear(subDays(today, 365)),
        end: endOfYear(subDays(today, 365)),
      },
    ];

    return (
      <Popover open={isPopoverOpen} onOpenChange={handleTogglePopover} >
        <PopoverTrigger asChild>
          <Button ref={ref} variant={variant} className={cn(className)}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedRange || "Select a date range"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-max">
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex  items-center space-x-2">
                <span>From:</span>
                <select
                  value={monthFrom?.getMonth()}
                  onChange={(e) => handleMonthChange(Number(e.target.value), "from")}
                >
                  {months.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
                <select value={yearFrom} onChange={(e) => handleYearChange(Number(e.target.value), "from")}>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span>To:</span>
                <select value={monthTo?.getMonth()} onChange={(e) => handleMonthChange(Number(e.target.value), "to")}>
                  {months.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
                <select value={yearTo} onChange={(e) => handleYearChange(Number(e.target.value), "to")}>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
                  <div className="flex gap-8 items-center justify-between">
                  <div className="mb-2 flex flex-col">
              {dateRanges.map(({ label, start, end }) => (
                <Button
                  key={label}
                  variant="outline"
                  className="mr-2 mb-2 w-[8rem]"
                  onClick={() => selectDateRange(start, end, label)}
                >
                  {label}
                </Button>
              ))}
            </div>
            <Calendar
              mode="range"
              selected={date}
              onSelect={handleDateSelect}
              numberOfMonths={numberOfMonths}
              fromMonth={startOfMonth(today)}
              toMonth={endOfMonth(today)}
            />
                  </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

CalendarDatePicker.displayName = "CalendarDatePicker";
