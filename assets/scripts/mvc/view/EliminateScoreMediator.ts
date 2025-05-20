import { INotification, Mediator } from "../../puremvc-typescript-standard-framework";
import { EffectComponent } from "../../component/EffectComponent";
import { EliminateScoreComponent } from "../../component/EliminateScoreComponent";

export class EliminateScoreMediator extends Mediator {
    public static NAME: string = "EliminateScoreMediator";

    private eliminateScoreComponent: EliminateScoreComponent = null;

    constructor(viewComponent?: any) {
        super(EliminateScoreMediator.NAME, viewComponent);
        this.eliminateScoreComponent = viewComponent;
    }

    public onRegister(): void {
        // console.log("onRegister EliminateScoreMediator, viewComponent:", this.eliminateScoreComponent);
    }

    // 列出該Mediator關心的Notification
    public listNotificationInterests(): string[] {
        return ["SAVED_ELIMINATESCORE_POS", "SAVED_MULTIPLE_SYMBOL", "SET_REMOVE_INFO", "SET_SCORE_VALUE", "SET_SCORE_VALUE_EliminateScoreComponent", "SET_MULTIPLE_VALUE", "RESET"];
    }

    public handleNotification(notification: INotification) {
        switch (notification.name) {
            case "SAVED_ELIMINATESCORE_POS":
                const EliminateBannerWorldPosition = this.eliminateScoreComponent.GetEliminateBannerWorldPosition;
                this.sendNotification("SET_ELIMINATESCORE_POS", EliminateBannerWorldPosition);
                break;
            case "SAVED_MULTIPLE_SYMBOL":
                const multipleSymbolInfo = notification.body;
                this.eliminateScoreComponent.SetMultipleSymbolPos = multipleSymbolInfo;
                break;
            case "SET_REMOVE_INFO":
                this.eliminateScoreComponent.SetRemoveSymbolRule = notification.body;
                break;
            case "SET_SCORE_VALUE":
            case "SET_SCORE_VALUE_EliminateScoreComponent":
                this.eliminateScoreComponent.SetScoreToShow = notification.body;
                break;
            case "SET_MULTIPLE_VALUE":
                this.eliminateScoreComponent.SetMultipleToCalculate = notification.body;
                break;
            case "RESET":
                this.eliminateScoreComponent.reset();
                break;
            default:
                break;
        }
    }
}


