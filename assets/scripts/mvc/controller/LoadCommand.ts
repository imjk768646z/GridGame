import { INotification, SimpleCommand } from "../../puremvc-typescript-standard-framework";
import { AssetsProxy } from "../model/AssetsProxy";
import { SlotProxy } from "../model/SlotProxy";

export class LoadCommand extends SimpleCommand {
    public execute(notification: INotification): void {
        // console.log("LoadCommand => ", notification);
        const LoadStateIns = notification.body;
        this.facade.registerProxy(new AssetsProxy(LoadStateIns));


        // 以下應該新增InitCommand 在命令中向ReelProxy拿到滾輪基本資料 在呼叫INIT_REELBAR設定給相關腳本
        // let slotProxy = this.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;
        // this.facade.sendNotification("SET_REELBAR", slotProxy.BaseReelData);
    }
}


