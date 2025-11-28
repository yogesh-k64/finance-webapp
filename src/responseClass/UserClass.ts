import type { User } from "../utils/interface";
import { isNonEmpty } from "../utils/utilsFunction";

export class UserClass {
  private id: number = 0;
  private name: string = "";
  private address: string = "";
  private info: string = "";
  private mobile: number = 0;
  private createdAt: Date = new Date();
  private updatedAt: Date = new Date();

  constructor(user?: User) {
    if (user) {
      if (isNonEmpty(user.id)) this.id = user.id;
      if (isNonEmpty(user.name)) this.name = user.name;
      if (isNonEmpty(user.address)) this.address = user.address;
      if (isNonEmpty(user.info)) this.info = user.info;
      if (isNonEmpty(user.mobile)) this.mobile = user.mobile;
      if (isNonEmpty(user.createdAt)) this.createdAt = new Date(user.createdAt);
      if (isNonEmpty(user.updatedAt)) this.updatedAt = new Date(user.updatedAt);
    }
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number) {
    this.id = id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string) {
    this.name = name;
  }

  public getAddress() {
    return this.address;
  }

  public setAddress(address: string) {
    this.address = address;
  }

  public getInfo(): string {
    return this.info;
  }
  public setInfo(info: string) {
    this.info = info;
  }
  public getMobile(): number {
    return this.mobile;
  }
  public setMobile(mobile: number) {
    this.mobile = mobile;
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
