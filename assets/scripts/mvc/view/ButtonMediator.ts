import { INotification, Mediator } from "../../puremvc-typescript-standard-framework";
import { EffectComponent } from "../../component/EffectComponent";
import { EliminateScoreComponent } from "../../component/EliminateScoreComponent";
import { ButtonComponent } from "../../component/ButtonComponent";

export class ButtonMediator extends Mediator {
    public static NAME: string = "ButtonMediator";

    private buttonComponent: ButtonComponent = null;

    constructor(viewComponent?: any) {
        super(ButtonMediator.NAME, viewComponent);
        this.buttonComponent = viewComponent;
    }

    public onRegister(): void {
        console.log("onRegister ButtonMediator, viewComponent:", this.buttonComponent);
    }

    // 列出該Mediator關心的Notification
    public listNotificationInterests(): string[] {
        return ["UPDATE_BUTTON_STATE", "UPDATE_AUTO_MODE"];
    }

    public handleNotification(notification: INotification) {
        switch (notification.name) {
            case "UPDATE_BUTTON_STATE":
                this.buttonComponent.updateButtonState(notification.body);
                break;
            case "UPDATE_AUTO_MODE":
                this.buttonComponent.updateAutoMode(notification.body);
                break;
            default:
                break;
        }
    }
}


