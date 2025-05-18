import type { Handout, collection } from "./interface";

export const getHandoutSummary = (list: Handout[], fromDate?: Date, endDate?: Date) => {
    return list.reduce(
        (acc, item) => {
            const bondAmt = item.amount <= 5000 ? 50 : 100;
            const profit = item.amount / 10 + bondAmt;
            const dateObj = new Date(item.date)
            if (fromDate && endDate) {
                if (dateObj >= fromDate && dateObj <= endDate) {
                    acc.total += item.amount;
                    acc.givenToCustomer += item.amount - profit;
                    acc.profit += profit;
                }
            } else {
                acc.total += item.amount;
                acc.givenToCustomer += item.amount - profit;
                acc.profit += profit;
            }
            return acc;
        },
        { total: 0, givenToCustomer: 0, profit: 0 }
    );
}

export const getCollectionSummary = (list: collection[], fromDate?: Date, endDate?: Date) => {
    return list.reduce((acc, item) => {
        const dateObj = new Date(item.date)
        if (fromDate && endDate) {
            if (dateObj >= fromDate && dateObj <= endDate) {
                acc.total += item.amount
            }
        } else {
            acc.total += item.amount
        }
        return acc
    }, { total: 0 })
}