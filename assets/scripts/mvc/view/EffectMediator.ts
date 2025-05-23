import { INotification, Mediator } from "../../puremvc-typescript-standard-framework";
import { EffectComponent } from "../../component/EffectComponent";

export class EffectMediator extends Mediator {
    public static NAME: string = "EffectMediator";

    private effectComponent: EffectComponent = null;

    constructor(viewComponent?: any) {
        super(EffectMediator.NAME, viewComponent);
        this.effectComponent = viewComponent;
    }

    public onRegister(): void {
        // console.log("onRegister EffectMediator, viewComponent:", this.effectComponent);
    }

    // 列出該Mediator關心的Notification
    public listNotificationInterests(): string[] {
        return ["SET_SYMBOL_POS", "FIRE_BALL", "SET_REMOVE_INFO", "SET_ELIMINATESCORE_POS", "SAVED_MULTIPLE_SYMBOL", "SET_BET_MULTIPLE"];
    }

    public handleNotification(notification: INotification) {
        switch (notification.name) {
            case "SET_SYMBOL_POS":
                this.effectComponent.SetSymbolsPosition = notification.body;
                break;
            case "SET_REMOVE_INFO":
                this.effectComponent.SetRemoveSymbolRule = notification.body;
                break;
            case "SET_ELIMINATESCORE_POS":
                this.effectComponent.SetEliminateBannerPosition = notification.body;
                break;
            case "SAVED_MULTIPLE_SYMBOL":
                const multipleSymbolInfo = notification.body;
                console.log("! 當前要處理的倍數:", multipleSymbolInfo);
                this.effectComponent.SetMultipleSymbolPos = multipleSymbolInfo;
                break;
            case "FIRE_BALL":
                //第幾個輪子第幾個位置要顯示火球
                const positions = notification.body;
                //延遲一段時間再丟出火球
                setTimeout(() => {
                    this.effectComponent.playFireBall(positions);
                }, 1000);
                break;
            case "SET_BET_MULTIPLE":
                this.effectComponent.SetBetMultiple = notification.body;
                break;
            default:
                break;
        }
    }
}


