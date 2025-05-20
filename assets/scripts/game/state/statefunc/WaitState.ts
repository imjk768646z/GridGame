import { IFSMEvent } from "../../../mvc/model/FSMProxy";
import { SlotProxy } from "../../../mvc/model/SlotProxy";
import { StateBase } from "../StateBase";
import { GameState } from "../GameState";

export class WaitState extends StateBase {

    onEnter(from?: GameState, event?: IFSMEvent): boolean {
        console.log("WaitState onEnter");
        return true;
    }

    on(from?: GameState, event?: IFSMEvent) {
        super.on(from, event);
        console.log("WaitState on");
        const slotProxy = event.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;
        slotProxy.resetNG();
        slotProxy.resetFG();
        // event.facade.sendNotification("SPIN_NORMAL");
        // event.facade.sendNotification("SPIN_NORMAL", slotProxy.startSpin());

        // 模擬寫入資料 讓後續動畫排程拿取得資料做相應處理
        // const st = { reels: "write success" };
        // event.facade.sendNotification("WRITE", st);


        //todo: wait狀態僅切換狀態機 不做滾輪旋轉 下一個狀態才呼叫旋轉 這裡所做的事情都將移至NGBeforeSpin
        //各個狀態腳本都藉由event獲取facade 再利用sendNotification和retrieveXXX拿到相關代理和執行命令
    }

    /* onExit(from?: GameState, event?: any) {
        console.log("WaitState onExit");
        return true;
    } */

    call(): void {
        console.log("動畫結束");
    }
}


