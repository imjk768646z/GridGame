import { ReelBar } from '../../component/ReelBar';
import { INotification, Mediator } from '../../puremvc-typescript-standard-framework';

export class ReelBarMediator extends Mediator {
    public static NAME: string = "ReelBarMediator";

    private reelBar: ReelBar = null;

    constructor(viewComponent?: ReelBar) {
        super(ReelBarMediator.NAME, viewComponent);
        this.reelBar = this.viewComponent;
    }

    public listNotificationInterests(): string[] {
        return ["SPIN_OUT", "SPIN_IN", "WRITE"];
    }

    public async handleNotification(notification: INotification): Promise<void> {
        let reelData;
        let callback;
        if (notification) {
            const Content = notification.body;
            if (Content.reels) reelData = Content.reels;
            if (Content.callback) callback = Content.callback;
        }

        switch (notification.name) {
            case "SPIN_OUT": //滾輪轉出畫面
                // const reels = notification.body;
                // this.reelBar.playSpin(reels);
                // use callback
                console.log("! SPIN_OUT");
                if (callback) {
                    this.reelBar.spinOut(callback);
                }
                // await this.simRolling();
                // console.log("! get slot proxy");

                break;
            case "SPIN_IN": //滾輪轉入畫面
                // 取出盤面結果 並執行轉動
                if (reelData) this.reelBar.spinIn(reelData);
                break;
            case "WRITE":
                this.reelBar.writeData(reelData);
                break;
            default:
                break;
        }
    }

    private getResult(): Promise<string> {
        console.log("取得滾輪最新結果");
        return new Promise((resovle, reject) => {
            setTimeout(async () => {
                // await this.reelBar.playSpin([]);
                console.log("! get slot proxy");
                resovle("success");
            }, 3000);
        })
    }

    public simRolling(): Promise<string> {
        return new Promise((resovle, reject) => {
            setTimeout(async () => {
                // await this.reelBar.playSpin([]);
                console.log("! go rolling");
                resovle("success");
            }, 3000);
        })
    }
}


