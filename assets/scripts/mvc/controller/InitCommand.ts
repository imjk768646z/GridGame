import { INotification, SimpleCommand } from "../../puremvc-typescript-standard-framework";
import { BetProxy } from "../model/BetProxy";
import { SlotProxy } from "../model/SlotProxy";

export class InitCommand extends SimpleCommand {
    public execute(notification: INotification): void {
        let slotProxy = this.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;
        this.facade.sendNotification("SET_REELBAR", slotProxy.GetBaseReelData);
        let betProxy = this.facade.retrieveProxy(BetProxy.NAME) as BetProxy;
        this.facade.sendNotification("SET_DEFAULT_BET", betProxy.GetCurrentBet);
    }
}


