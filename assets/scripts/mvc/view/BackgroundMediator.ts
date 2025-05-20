import { INotification, Mediator } from "../../puremvc-typescript-standard-framework";
import { BackgroundComponent } from "../../component/BackgroundComponent";

export class BackgroundMediator extends Mediator {
    public static NAME: string = "BackgroundMediator";

    private backgroundComponent: BackgroundComponent = null;

    constructor(viewComponent?: any) {
        super(BackgroundMediator.NAME, viewComponent);
        this.backgroundComponent = viewComponent;
    }

    public onRegister(): void {
        // console.log("onRegister BackgroundMediator, viewComponent:", this.backgroundComponent);
    }

    // 列出該Mediator關心的Notification
    public listNotificationInterests(): string[] {
        return ["LUBU_FIRE", "SET_REMOVE_INFO", "UPDATE_FG_ROUND"];
    }

    public handleNotification(notification: INotification) {
        switch (notification.name) {
            case "LUBU_FIRE":
                this.backgroundComponent.playLubuFire();
                break;
            case "SET_REMOVE_INFO":
                this.backgroundComponent.SetRemoveSymbolRule = notification.body;
                break;
            case "UPDATE_FG_ROUND":
                this.backgroundComponent.updateFGRound(notification.body);
                break;
            default:
                break;
        }
    }
}


