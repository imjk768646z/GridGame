import { FSMProxy, IFSMEvent } from "../../../mvc/model/FSMProxy";
import { SlotProxy } from "../../../mvc/model/SlotProxy";
import { StateBase } from "../StateBase";
import { GameState } from "../GameState";
import { BetProxy } from "../../../mvc/model/BetProxy";
import { GameFacade } from "../../../GameFacade";
import { SignalAction } from "../../../Definition";

export class WaitState extends StateBase {

    onEnter(from?: GameState, event?: IFSMEvent): boolean {
        console.log("WaitState onEnter");
        return true;
    }

    on(from?: GameState, event?: IFSMEvent) {
        super.on(from, event);
        console.log("WaitState on");
        const slotProxy = event.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;
        const fsmProxy = this.event.facade.retrieveProxy(FSMProxy.NAME) as FSMProxy;
        slotProxy.resetNG();
        slotProxy.resetFG();

        if (slotProxy.GetAutoMode) { //是否為自動模式
            // 延遲是為了在自動模式下看清楚總分(餘額)的變化後，再進行下一局，因為轉動時會立即扣點
            setTimeout(() => {
                event.fsm.go(GameState.NGSpin, fsmProxy.fsmEvent(GameFacade.NGSPIN, SignalAction.NG.SpinStart));
            }, 500);
            
        }
        // event.facade.sendNotification("SPIN_NORMAL");
        // event.facade.sendNotification("SPIN_NORMAL", slotProxy.startSpin());

        // 模擬寫入資料 讓後續動畫排程拿取得資料做相應處理
        // const st = { reels: "write success" };
        // event.facade.sendNotification("WRITE", st);


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


