import { LoadScene } from "../../LoadScene";
import { INotification, Mediator } from "../../puremvc-typescript-standard-framework";

export class LoadMediator extends Mediator {
    public static NAME: string = "LoadMediator";
    private loadScene: LoadScene = null;

    constructor(viewComponent?: any) {
        super(LoadMediator.NAME, viewComponent);
        this.loadScene = viewComponent;
    }
    /**
     * 主場景腳本在實例化GameMediator時將按鈕節點放進來 再進一步設定按鈕監聽事件
     */
    public onRegister(): void {

    }

    // 列出該Mediator關心的Notification
    public listNotificationInterests(): string[] {
        return ["UPDATE_PROGRESS", "LOADING_END"];
    }

    // 處理Notification
    public handleNotification(notification: INotification) {
        const Content = notification.body;
        switch (notification.name) {
            case "UPDATE_PROGRESS":
                this.loadScene.updateLoadingBar(Content.progress, Content.msg);
                break;
            case "LOADING_END":
                this.loadScene.hide();
                break;
            default:
                break;
        }
    }
}


