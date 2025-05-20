import { Node, NodeEventType } from "cc";
import { INotification, Mediator } from "../../puremvc-typescript-standard-framework";
import { ReelControl } from "../../component/ReelControl";
import { ReelBar } from "../../component/ReelBar";
import { MultipleProxy } from "../model/MultipleProxy";

export class GameMediator extends Mediator {
    public static NAME: string = "GameMediator";
    // private spinButton: Node = null;
    private reelControl: ReelControl = null;
    // todo: 新增成員變數 所有GameScene的子節點腳本
    private reelBars: ReelBar[] = null;
    constructor(viewComponent?: any) {
        super(GameMediator.NAME, viewComponent);
        // this.spinButton = viewComponent;
        this.reelControl = viewComponent.reelControl;
        this.reelBars = viewComponent.reelControl.reelBars;
    }
    /**
     * 主場景腳本在實例化GameMediator時將按鈕節點放進來 再進一步設定按鈕監聽事件
     */
    public onRegister(): void {
        // console.log("onRegister GameMediator, viewComponent:", this.reelControl);
    }

    // 列出該Mediator關心的Notification
    public listNotificationInterests(): string[] {
        return ["SET_REELBAR", "SET_ASSETS", "SPIN_OUT", "SPIN_IN", "SET_REMOVE_INFO", "SAVED_SYMBOL_POS", "SET_MULTIPLE_TEXT", "SEARCH_MULTIPLE_SYMBOL", "SAVED_MULTIPLE_SYMBOL", "RESET_REEL"];
    }

    // 處理Notification
    public handleNotification(notification: INotification) {

        switch (notification.name) {
            case "SET_REELBAR": //所有和初始化滾輪相關的設定都應該在這個階段完成
                const BaseReelData = notification.body;
                //設定給ReelControl 再由ReelControl分配給每個ReelBar
                this.reelControl.SetBaseReelData = BaseReelData;
                break;
            case "SET_ASSETS":
                const Assets = notification.body;
                this.reelControl.SetAssets = Assets;
                break;
            case "SPIN_OUT":
                const SpinOutComplete = notification.body;
                // this.reelBars[0].spinOut(RollingCallback);
                this.reelControl.spinOut(SpinOutComplete);
                break;
            case "SPIN_IN":
                const ResultReel = notification.body;
                this.reelControl.spinIn(ResultReel);
                // this.reelControl.SetAssets = Assets;
                break;
            case "SET_MULTIPLE_TEXT":
                // 將指定的symbol設定倍率文字
                const MultipleInfo = notification.body;
                this.reelControl.updateMultipleText(MultipleInfo);
                break;
            case "SET_REMOVE_INFO":
                // 參考Assets的做法 不要分開存取資料 一次性存取 之後在各個腳本針對屬性名稱取出使用
                // const RemoveInfo = notification.body;
                // this.reelControl.SetRemoveInfo = RemoveInfo;
                const RemoveSymbolRule = notification.body;
                this.reelControl.SetRemoveSymbolRule = RemoveSymbolRule;
                break;
            case "SAVED_SYMBOL_POS": //紀錄所有Symbol的世界座標
                const AllSymbolWorldPosition = this.reelControl.GetSymbolWorldPosition;
                this.sendNotification("SET_SYMBOL_POS", AllSymbolWorldPosition);
                break;
            case "SEARCH_MULTIPLE_SYMBOL":
                // 從ReelContorl拿到資料後 再存入MultipleProxy
                let multipleSymbolPos = this.reelControl.searchMultipleSymbol();
                const multipleProxy = this.facade.retrieveProxy(MultipleProxy.NAME) as MultipleProxy;
                multipleProxy.SetMultipleSymbol = multipleSymbolPos;
                break;
            case "SAVED_MULTIPLE_SYMBOL":
                const multipleSymbolInfo = notification.body;
                this.reelControl.SetMultipleSymbolPos = multipleSymbolInfo;
                break;
            case "RESET_REEL":
                this.reelControl.reset();
                break;
            default:
                break;
        }
    }
}