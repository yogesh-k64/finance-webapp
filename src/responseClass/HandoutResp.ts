import { isNonEmpty } from "../utils/utilsFunction";
import { HandoutClass } from "./HandoutClass";
import { UserClass } from "./UserClass";

export class HandoutRespClass {
  private handout: HandoutClass = new HandoutClass();
  private user: UserClass = new UserClass();

  constructor(handoutResp?: any) {
    if (handoutResp) {
      if (isNonEmpty(handoutResp.handout)) this.handout = new HandoutClass(handoutResp.handout);
      if (isNonEmpty(handoutResp.user)) this.user = new UserClass(handoutResp.user);
    }
  }

  public getHandout(): HandoutClass {
    return this.handout;
  }

  public setHandout(handout: HandoutClass) {
    this.handout = handout;
  }

  public getUser(): UserClass {
    return this.user;
  }

  public setUser(user: UserClass) {
    this.user = user;
  }
}
