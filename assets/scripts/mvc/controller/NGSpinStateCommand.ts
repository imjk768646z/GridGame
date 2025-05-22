import { INotification, SimpleCommand } from "../../puremvc-typescript-standard-framework";
import { BetProxy } from "../model/BetProxy";
import { MultipleProxy } from "../model/MultipleProxy";
import { ScoreProxy } from "../model/ScoreProxy";
import { MultipleInfo, RemoveSymbolRule, SlotProxy } from "../model/SlotProxy";

export class NGSpinStateCommand extends SimpleCommand {
    public execute(notification: INotification): void {
        const betProxy = this.facade.retrieveProxy(BetProxy.NAME) as BetProxy;
        this.sendNotification("UPDATE_CREDIT", betProxy.GetCurrentBet);
    }
}


