import { INotification, Mediator } from "../../puremvc-typescript-standard-framework";
import { TransitionComponent } from "../../component/TransitionComponent";

export class TransitionMediator extends Mediator {
    public static NAME: string = "TransitionMediator";

    private transitionComponent: TransitionComponent = null;

    constructor(viewComponent?: any) {
        super(TransitionMediator.NAME, viewComponent);
        this.transitionComponent = viewComponent;
    }

    public onRegister(): void {
        // console.log("onRegister TransitionMediator, viewComponent:", this.transitionComponent);
    }

    // 列出該Mediator關心的Notification
    public listNotificationInterests(): string[] {
        return ["SET_FG_TOTAL_ROUND", "SET_SCORE_VALUE_TransitionComponent"];
    }

    public handleNotification(notification: INotification) {
        switch (notification.name) {
            case "SET_FG_TOTAL_ROUND":
                this.transitionComponent.SetFGTotalRound = notification.body;
                break;
            case "SET_SCORE_VALUE_TransitionComponent":
                this.transitionComponent.SetScoreToShow = notification.body;
                break;
            default:
                break;
        }
    }
}


