import type { Handout } from "../utils/interface";
import { isNonEmpty } from "../utils/utilsFunction";

export class HandoutClass {
  private id: number = 0;
  private amount: number = 0;
  private date: Date = new Date();
  private createdAt: Date = new Date();
  private updatedAt: Date = new Date();

  constructor(handout?: Handout) {
    if (handout) {
      if (isNonEmpty(handout.id)) this.id = handout.id;
      if (isNonEmpty(handout.amount)) this.amount = handout.amount;
      if (isNonEmpty(handout.date)) this.date = new Date(handout.date);
      if (isNonEmpty(handout.createdAt)) this.createdAt = new Date(handout.createdAt);
      if (isNonEmpty(handout.updatedAt)) this.updatedAt = new Date(handout.updatedAt);
    }
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number) {
    this.id = id;
  }

  public getAmount(): number {
    return this.amount;
  }

  public setAmount(amount: number) {
    this.amount = amount;
  }

  public getDate(): Date {
    return this.date;
  }

  public getDateStr(): string {
    return this.date.toDateString();
  }

  public setDate(date: Date) {
    this.date = date;
  }

  public getCreatedAt(): string {
    return this.createdAt.toDateString();
  }

  public setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }

  public getUpdatedAt(): string {
    return this.updatedAt.toDateString();
  }

  public setUpdatedAt(updatedAt: Date) {
    this.updatedAt = updatedAt;
  }
}
