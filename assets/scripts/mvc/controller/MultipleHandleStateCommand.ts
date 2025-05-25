import { INotification, SimpleCommand } from "../../puremvc-typescript-standard-framework";
import { MultipleProxy } from "../model/MultipleProxy";
import { ScoreProxy } from "../model/ScoreProxy";
import { MultipleInfo, RemoveSymbolRule, SlotProxy } from "../model/SlotProxy";

export class MultipleHandleStateCommand extends SimpleCommand {
    public execute(notification: INotification): void {

        const multipleProxy = this.facade.retrieveProxy(MultipleProxy.NAME) as MultipleProxy;
        const CurrentMultiple = multipleProxy.getCurrentMultiplePos();
        this.facade.sendNotification("SAVED_MULTIPLE_SYMBOL", CurrentMultiple);

        // 注意:multipleProxy.getCurrentMultiplePos() 在這只能呼叫一次
        // 取出multipleProxy.getCurrentMultiplePos()裡面的multiple 將它存放到ScoreProxy做計算
        const scoreProxy = this.facade.retrieveProxy(ScoreProxy.NAME) as ScoreProxy;
        // CurrentMultiple[0] 目前一個滾輪中只會出現一個倍數圖標，因此直接取得陣列中唯一的元素
        let multiple = CurrentMultiple[0].multiplText.substring(0, CurrentMultiple[0].multiplText.length - 1);
        scoreProxy.SetMultiple = Number(multiple);
        // 將每一個相關的變數 利用sendNotification 存到相關腳本
        this.facade.sendNotification("SET_MULTIPLE_VALUE", scoreProxy.GetMultiple);
        this.facade.sendNotification("SET_SCORE_VALUE", scoreProxy.GetScore);
    }
}


