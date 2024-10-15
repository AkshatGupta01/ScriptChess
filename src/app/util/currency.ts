import { formatCurrency } from "@angular/common"
import { LOCALE_ID } from "@angular/core"

export function formatCurrencyValue(value : number) {
    return formatCurrency(value, "en-in", "₹ ")
}

export function titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
}

export function formatMoney(n) {
  return (Math.round(n * 100) / 100).toLocaleString();
}

export function getUniqueId(parts: number): string {
    const stringArr = [];
    for(let i = 0; i< parts; i++){
      // tslint:disable-next-line:no-bitwise
      const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      stringArr.push(S4);
    }
    return stringArr.join('-');
  }