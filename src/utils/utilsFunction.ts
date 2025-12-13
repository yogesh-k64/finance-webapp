import type { CollectionClass } from "../responseClass/CollectionClass";
import type { HandoutRespClass } from "../responseClass/HandoutResp";
import type { IndianNumberFormatOptions, WeekInfo } from "./interface";

export const getCurrentWeekNumber = (): number => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let weekNumber = 1;
  let weekStart = new Date(firstDay);
  let weekEnd = new Date(firstDay);
  weekEnd.setDate(weekEnd.getDate() + 6);

  while (weekEnd <= lastDay) {
    if (now >= weekStart && now <= (weekEnd > lastDay ? lastDay : weekEnd)) {
      return weekNumber;
    }
    weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() + 1);
    weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekNumber++;
  }

  return weekNumber;
};

export const getCurrentMonthWeeks = (): WeekInfo[] => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Get first and last day of current month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const weeks: WeekInfo[] = [];
  let weekNumber = 1;
  const currentDate = new Date(firstDay);

  while (currentDate <= lastDay) {
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + 6);

    // If week end goes beyond month, cap it at last day of month
    if (weekEnd > lastDay) {
      weeks.push({
        weekNumber,
        startDate: weekStart,
        endDate: new Date(lastDay),
      });
      break;
    } else {
      weeks.push({ weekNumber, startDate: weekStart, endDate: weekEnd });
    }

    currentDate.setDate(currentDate.getDate() + 7);
    weekNumber++;
  }

  return weeks;
};

export const getHandoutSummary = (
  list: HandoutRespClass[],
  fromDate?: Date,
  endDate?: Date
) => {
  return list.reduce(
    (acc, item) => {
      const handout = item.getHandout();
      const amount = handout.getAmount();
      const bondAmt = item.getHandout().getBond() ? amount <= 5000 ? 50 : 100 : 0;
      const profit = amount / 10 + bondAmt;
      const dateObj = new Date(handout.getDate());
      const status = handout.getStatus();
      
      if (fromDate && endDate) {
        if (dateObj >= fromDate && dateObj <= endDate) {
          acc.total += amount;
          acc.givenToCustomer += amount - profit;
          acc.profit += profit;
          
          // Track status breakdown
          if (status === "ACTIVE") {
            acc.statusBreakdown.active.count++;
            acc.statusBreakdown.active.total += amount;
          } else if (status === "COMPLETED") {
            acc.statusBreakdown.completed.count++;
            acc.statusBreakdown.completed.total += amount;
          } else if (status === "PENDING") {
            acc.statusBreakdown.pending.count++;
            acc.statusBreakdown.pending.total += amount;
          } else if (status === "CANCELLED") {
            acc.statusBreakdown.cancelled.count++;
            acc.statusBreakdown.cancelled.total += amount;
          }
        }
      } else {
        acc.total += amount;
        acc.givenToCustomer += amount - profit;
        acc.profit += profit;
        
        // Track status breakdown
        if (status === "ACTIVE") {
          acc.statusBreakdown.active.count++;
          acc.statusBreakdown.active.total += amount;
        } else if (status === "COMPLETED") {
          acc.statusBreakdown.completed.count++;
          acc.statusBreakdown.completed.total += amount;
        } else if (status === "PENDING") {
          acc.statusBreakdown.pending.count++;
          acc.statusBreakdown.pending.total += amount;
        } else if (status === "CANCELLED") {
          acc.statusBreakdown.cancelled.count++;
          acc.statusBreakdown.cancelled.total += amount;
        }
      }
      return acc;
    },
    { 
      total: 0, 
      givenToCustomer: 0, 
      profit: 0,
      statusBreakdown: {
        active: { count: 0, total: 0 },
        completed: { count: 0, total: 0 },
        pending: { count: 0, total: 0 },
        cancelled: { count: 0, total: 0 }
      }
    }
  );
};

export const getCollectionSummary = (
  list: CollectionClass[],
  fromDate?: Date,
  endDate?: Date
) => {
  return list.reduce(
    (acc, item) => {
      const dateObj = new Date(item.getDate());
      if (fromDate && endDate) {
        if (dateObj >= fromDate && dateObj <= endDate) {
          acc.total += item.getAmount();
        }
      } else {
        acc.total += item.getAmount();
      }
      return acc;
    },
    { total: 0 }
  );
};

export const isEmpty = (variable: any) => {
  const type = typeof variable;
  if (variable === null) return true;
  if (type === "undefined") return true;
  if (type === "boolean") return false;
  if (type === "string") return !variable.trim();
  if (type === "number") return false;
  if (variable instanceof Date) return isNaN(variable.getTime());
  if (Array.isArray(variable)) return !variable.length;
  if (type === "object") return !Object.keys(variable).length;
  return !variable;
};

export const isNonEmpty = (variable: any) => {
  return !isEmpty(variable);
};

export const copyToClipboard = (text: string | number) => {
  navigator.clipboard.writeText(String(text));
};

export const formatDateToCustomString = (dateString: string): string => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [year, month, day] = dateString.split("-");
  const monthName = months[parseInt(month, 10) - 1];
  const shortYear = year.slice(-2);
  const dayNumber = parseInt(day, 10);

  // Add the appropriate suffix to the day
  let suffix = "th";
  if (dayNumber < 11 || dayNumber > 13) {
    switch (dayNumber % 10) {
      case 1:
        suffix = "st";
        break;
      case 2:
        suffix = "nd";
        break;
      case 3:
        suffix = "rd";
        break;
    }
  }

  return `${dayNumber}${suffix} ${monthName} ${shortYear}`;
};

export const formatDateRange = (dateRangeString: string): string => {
  const [startDate, endDate] = dateRangeString.split(" ~ ");
  if (!startDate || !endDate) return dateRangeString;

  return `${formatDateToCustomString(startDate)} - ${formatDateToCustomString(endDate)}`;
};

export const getValueByKey = (obj: any, key: string): any => {
  if (isEmpty(obj) || isEmpty(key)) return undefined;

  // Handle nested method calls like "getHandout.getId"
  if (key.includes(".")) {
    const keys = key.split(".");
    let value = obj;
    for (const k of keys) {
      if (value === undefined || value === null) return undefined;
      if (typeof value[k] === "function") {
        value = value[k]();
      } else if (k in value) {
        value = value[k];
      } else {
        return undefined;
      }
    }
    return value;
  }

  if (typeof obj[key] === "function") {
    return obj[key]();
  }

  if (key in obj) {
    return obj[key];
  }

  return undefined;
};

export function formatNumber(
  num: number | string,
  options: IndianNumberFormatOptions = {}
): string {
  const config = {
    lakh: true,
    crore: true,
    comma: true,
    decimalPrecision: 2,
    rupees: true,
    ...options,
  };

  const number = typeof num === "string" ? parseFloat(num) : num;

  if (isNaN(number)) {
    return "Invalid number";
  }

  const isNegative = number < 0;
  const absoluteNum = Math.abs(number);

  let result: string;
  let suffix = "";

  if (config.crore && absoluteNum >= 10000000) {
    const croreValue = absoluteNum / 10000000;
    result = formatWithPrecision(croreValue, config.decimalPrecision);
    suffix = " Cr";
  } else if (config.lakh && absoluteNum >= 100000) {
    const lakhValue = absoluteNum / 100000;
    result = formatWithPrecision(lakhValue, config.decimalPrecision);
    suffix = " L";
  } else {
    result = formatWithPrecision(absoluteNum, config.decimalPrecision);
  }

  result = result + suffix;

  if (config.comma) {
    result = addIndianCommas(result);
  }

  return isNegative
    ? `-${result} ${config.rupees ? "₹" : ""}`
    : `${result} ${config.rupees ? "₹" : ""}`;
}

function formatWithPrecision(num: number, precision: number): string {
  if (precision === 0) {
    return Math.round(num).toString();
  }

  const rounded = num.toFixed(precision);
  return parseFloat(rounded).toString();
}

function addIndianCommas(numStr: string): string {
  const suffixMatch = numStr.match(/\s+(Cr|L)$/);
  let suffix = "";
  let valuePart = numStr;

  if (suffixMatch) {
    suffix = suffixMatch[0];
    valuePart = numStr.substring(0, numStr.length - suffix.length);
  }

  const parts = valuePart.split(".");
  let integerPart = parts[0];
  const decimalPart = parts.length > 1 ? `.${parts[1]}` : "";

  const lastThree = integerPart.slice(-3);
  const otherNumbers = integerPart.slice(0, -3);

  if (otherNumbers !== "") {
    const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    integerPart = `${formattedOther},${lastThree}`;
  }

  return `${integerPart}${decimalPart}${suffix}`;
}
