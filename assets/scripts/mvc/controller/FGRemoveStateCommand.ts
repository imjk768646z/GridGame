import { INotification, SimpleCommand } from "../../puremvc-typescript-standard-framework";
import { BetProxy } from "../model/BetProxy";
import { ScoreProxy } from "../model/ScoreProxy";
import { MultipleInfo, RemoveSymbolRule, SlotProxy } from "../model/SlotProxy";

export class FGRemoveStateCommand extends SimpleCommand {
    public execute(notification: INotification): void {
        const slotProxy = this.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;

        const removeSymbolRule = slotProxy.getFGRemoveUpdateReelData() as RemoveSymbolRule | null;
        // console.log("執行[FG消去]動畫之前 寫入消去的資訊到ReelBar:", removeSymbolRule);
        this.facade.sendNotification("SET_REMOVE_INFO", removeSymbolRule);
        const betProxy = this.facade.retrieveProxy(BetProxy.NAME) as BetProxy;
        this.facade.sendNotification("SET_BET_MULTIPLE", betProxy.GetCurrentBetMultiple);

        // 取出removeSymbolRule裡面的score 將它存放到ScoreProxy
        // 使用FG專屬的方式處理ScoreProxy
        if (removeSymbolRule != null) {
            const scoreProxy = this.facade.retrieveProxy(ScoreProxy.NAME) as ScoreProxy;
            scoreProxy.SetScoreFGState = removeSymbolRule.score;
            // 將每一個相關的變數 利用sendNotification 存到相關腳本 (必須考量到進入倍數處理的狀態機 是否能正常運作)
            this.facade.sendNotification("SET_SCORE_VALUE_MainInformationComponent", scoreProxy.GetScore);
            this.facade.sendNotification("SET_SCORE_VALUE_EliminateScoreComponent", scoreProxy.GetEliminateScore);
            // 設定一份給TransitionComponent
            // this.facade.sendNotification("SET_SCORE_VALUE_TransitionComponent", scoreProxy.GetScore);
        }
    }
}


