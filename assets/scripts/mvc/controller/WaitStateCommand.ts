import { INotification, SimpleCommand } from "../../puremvc-typescript-standard-framework";
import { ScoreProxy } from "../model/ScoreProxy";
import { MultipleInfo, RemoveSymbolRule, SlotProxy } from "../model/SlotProxy";

export class WaitStateCommand extends SimpleCommand {
    public execute(notification: INotification): void {
        //todo: 重置ScoreProxy所有資料
        const scoreProxy = this.facade.retrieveProxy(ScoreProxy.NAME) as ScoreProxy;
        scoreProxy.reset();
        this.facade.sendNotification("RESET");
    }
}


