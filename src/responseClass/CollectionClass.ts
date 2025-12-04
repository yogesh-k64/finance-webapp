import { formatNumber, isNonEmpty } from "../utils/utilsFunction";

export class CollectionClass {
  private id: number = 0;
  private amount: number = 0;
  private handoutId: number = 0;
  private date: Date = new Date();
  private createdAt: Date = new Date();
  private updatedAt: Date = new Date();

  constructor(collection?: any) {
    if (collection) {
      if (isNonEmpty(collection.id)) this.id = collection.id;
      if (isNonEmpty(collection.amount)) this.amount = collection.amount;
      if (isNonEmpty(collection.handoutId))
        this.handoutId = collection.handoutId;
      if (isNonEmpty(collection.date)) this.date = new Date(collection.date);
      if (isNonEmpty(collection.createdAt))
        this.createdAt = new Date(collection.createdAt);
      if (isNonEmpty(collection.updatedAt))
        this.updatedAt = new Date(collection.updatedAt);
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

  public getHandoutId(): number {
    return this.handoutId;
  }

  public setHandoutId(handoutId: number) {
    this.handoutId = handoutId;
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
