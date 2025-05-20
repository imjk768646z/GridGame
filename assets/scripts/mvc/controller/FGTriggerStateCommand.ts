import { INotification, SimpleCommand } from "../../puremvc-typescript-standard-framework";
import { ScoreProxy } from "../model/ScoreProxy";
import { MultipleInfo, RemoveSymbolRule, SlotProxy } from "../model/SlotProxy";

export class FGTriggerStateCommand extends SimpleCommand {
    public execute(notification: INotification): void {
        const slotProxy = this.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;

        const fgSymbolScore = slotProxy.getFGSymbolScore();
        const scoreProxy = this.facade.retrieveProxy(ScoreProxy.NAME) as ScoreProxy;
        scoreProxy.SetScoreFGState = fgSymbolScore;
        // 將每一個相關的變數 利用sendNotification 存到相關腳本 (必須考量到進入倍數處理的狀態機 是否能正常運作)
        this.facade.sendNotification("SET_SCORE_VALUE_MainInformationComponent", scoreProxy.GetScore);
        this.facade.sendNotification("SET_SCORE_VALUE_EliminateScoreComponent", scoreProxy.GetEliminateScore);

        this.facade.sendNotification("SET_FG_TOTAL_ROUND", slotProxy.GetFGTotalRound);
    }
}


