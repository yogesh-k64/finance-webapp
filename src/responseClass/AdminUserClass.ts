import { isNonEmpty } from "../utils/utilsFunction";

export class AdminUserClass {
  private id: number = 0;
  private username: string = "";
  private role: string = "";
  private active: boolean = true;
  private createdAt: Date = new Date();
  private updatedAt: Date = new Date();

  constructor(user?: any) {
    if (user) {
      if (isNonEmpty(user.id)) this.id = user.id;
      if (isNonEmpty(user.username)) this.username = user.username;
      if (isNonEmpty(user.role)) this.role = user.role;
      if (isNonEmpty(user.active)) this.active = user.active;
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

  public getUsername(): string {
    return this.username;
  }

  public setUsername(username: string) {
    this.username = username;
  }

  public getRole(): string {
    return this.role;
  }

  public setRole(role: string) {
    this.role = role;
  }

  public getActive(): boolean {
    return this.active;
  }

  public setActive(active: boolean) {
    this.active = active;
  }

  public getStatus(): string {
    return this.active ? "ACTIVE" : "DISABLED";
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

  public disableEdit(): boolean {
    return this.username === "admin";
  }

  public disableDelete(): boolean {
    return this.username === "admin";
  }
}
