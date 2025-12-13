import { formatNumber, isNonEmpty } from "../utils/utilsFunction";

export class HandoutClass {
  private id: number = 0;
  private amount: number = 0;
  private date: Date = new Date();
  private createdAt: Date = new Date();
  private updatedAt: Date = new Date();
  private status: string = "ACTIVE";
  private bond: boolean = false;

  constructor(handout?: any) {
    if (handout) {
      if (isNonEmpty(handout.id)) this.id = handout.id;
      if (isNonEmpty(handout.amount)) this.amount = handout.amount;
      if (isNonEmpty(handout.date)) this.date = new Date(handout.date);
      if (isNonEmpty(handout.createdAt))
        this.createdAt = new Date(handout.createdAt);
      if (isNonEmpty(handout.updatedAt))
        this.updatedAt = new Date(handout.updatedAt);
      if (isNonEmpty(handout.status)) this.status = handout.status;
      if (isNonEmpty(handout.bond)) this.bond = handout.bond;
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

  public getDispAmount(): string {
    return formatNumber(this.amount);
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

  public getStatus(): string {
    return this.status;
  }

  public setStatus(status: string) {
    this.status = status;
  }

  public getBond(): boolean {
    return this.bond;
  }

  public getBondDisplay(): string {
    return this.bond ? "Yes" : "No";
  }

  public setBond(bond: boolean) {
    this.bond = bond;
  }
}
