import { FSMProxy, IFSMEvent } from "../../../mvc/model/FSMProxy";
import { SlotProxy } from "../../../mvc/model/SlotProxy";
import { StateBase } from "../StateBase";
import { GameState } from "../GameState";
import { GameFacade } from "../../../GameFacade";
import { SignalAction } from "../../../Definition";
import { MultipleProxy } from "../../../mvc/model/MultipleProxy";

export class RemoveState extends StateBase {
    onEnter(from?: GameState, event?: IFSMEvent): boolean {
        console.log("RemoveState onEnter");
        return true;
    }

    on(from?: GameState, event?: IFSMEvent) {
        super.on(from, event);
        console.log("RemoveState on");

    }

    /* onExit(from?: GameState, event?: any) {
        console.log("RemoveState onExit");
        return true;
    } */

    call(): void {
        console.log("動畫結束");
        const slotProxy = this.event.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;
        /* if (slotProxy.isRemove()) {
            console.log("繼續切換到RemoveState");
            //todo: 確定完成所有消去動畫再切換狀態機
            const fsmProxy = this.event.facade.retrieveProxy(FSMProxy.NAME) as FSMProxy;
            this.event.fsm.go(GameState.Remove, fsmProxy.fsmEvent(GameFacade.REMOVE, SignalAction.NG.Remove));
        } else {
            console.log("切換到開獎狀態");
        } */
        const fsmProxy = this.event.facade.retrieveProxy(FSMProxy.NAME) as FSMProxy;
        if (slotProxy.isNextRemove()) {
            console.log("進行下一個消除");

            this.event.fsm.go(GameState.Remove, fsmProxy.fsmEvent(GameFacade.REMOVE, SignalAction.NG.Remove));
        } else {
            if (slotProxy.hasMultipleInfo()) {
                console.log("切換狀態機 處理倍數移動");
                //todo: 嘗試從slotProxy取得所有倍數的位置 內容必須是MultipleSymbolInfo 再寫入MultipleProxy
                /* console.log("!! 切換倍數處理之前 所有的倍數資訊:",slotProxy.GetAllMultipleSymbolInfo);
                const multipleProxy = this.event.facade.retrieveProxy(MultipleProxy.NAME) as MultipleProxy;
                multipleProxy.SetMultipleSymbol = slotProxy.GetAllMultipleSymbolInfo; */
                this.event.facade.sendNotification("SEARCH_MULTIPLE_SYMBOL"); //進入MultipleHandle之前只會執行一次(注意:只能呼叫一次)
                this.event.fsm.go(GameState.MultipleHandle, fsmProxy.fsmEvent(GameFacade.MULTIPLE_HANDLE, SignalAction.NG.MultipleHandle));
            } else {
                console.log("切換到NGShowWin 更新總分");
                this.event.fsm.go(GameState.NGShowWin, fsmProxy.fsmEvent(null, SignalAction.NG.Win));
            }
        }
    }
}


