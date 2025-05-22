import { INotification, Mediator } from "../../puremvc-typescript-standard-framework";
import { MainInformationComponent } from "../../component/MainInformationComponent";

export class MainInformationMediator extends Mediator {
    public static NAME: string = "MainInformationMediator";

    private mainInformationComponent: MainInformationComponent = null;

    constructor(viewComponent?: any) {
        super(MainInformationMediator.NAME, viewComponent);
        this.mainInformationComponent = viewComponent;
    }

    public onRegister(): void {
        // console.log("onRegister MainInformationMediator, viewComponent:", this.mainInformationComponent);
    }

    // 列出該Mediator關心的Notification
    public listNotificationInterests(): string[] {
        return ["SET_REMOVE_INFO", "SET_SCORE_VALUE", "SET_SCORE_VALUE_MainInformationComponent", "SET_DEFAULT_BET", "UPDATE_CREDIT"];
    }

    public handleNotification(notification: INotification) {
        switch (notification.name) {
            case "SET_REMOVE_INFO":
                this.mainInformationComponent.SetRemoveSymbolRule = notification.body;
                break;
            case "SET_SCORE_VALUE_MainInformationComponent":
            case "SET_SCORE_VALUE":
                this.mainInformationComponent.SetScoreToShow = notification.body;
                break;
            case "SET_DEFAULT_BET":
                this.mainInformationComponent.updateTotalBet(notification.body);
                break;
            case "UPDATE_CREDIT":
                this.mainInformationComponent.updateCredit(notification.body);
                break;
            default:
                break;
        }
    }
}


