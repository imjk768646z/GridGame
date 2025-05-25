import { FSMProxy, IFSMEvent } from "../../../mvc/model/FSMProxy";
import { SlotProxy } from "../../../mvc/model/SlotProxy";
import { StateBase } from "../StateBase";
import { GameState } from "../GameState";
import { GameFacade } from "../../../GameFacade";
import { SignalAction } from "../../../Definition";
import { ScoreProxy } from "../../../mvc/model/ScoreProxy";

export class FGRemoveState extends StateBase {
    onEnter(from?: GameState, event?: IFSMEvent): boolean {
        console.log("FGRemoveState onEnter");
        return true;
    }

    on(from?: GameState, event?: IFSMEvent) {
        super.on(from, event);
        console.log("FGRemoveState on");
        const slotProxy = event.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;

    }

    /* onExit(from?: GameState, event?: any) {
        console.log("FGRemoveState onExit");
        return true;
    } */

    call(): void {
        console.log("動畫結束");
        const slotProxy = this.event.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;
        const fsmProxy = this.event.facade.retrieveProxy(FSMProxy.NAME) as FSMProxy;
        if (slotProxy.isNextFGRemove()) {
            this.event.fsm.go(GameState.FGRemove, fsmProxy.fsmEvent(GameFacade.FGREMOVE, SignalAction.FG.Remove));
        } else {
            if (slotProxy.hasFGMultipleInfo()) {
                this.event.facade.sendNotification("SEARCH_MULTIPLE_SYMBOL"); //進入MultipleHandle之前只會執行一次(注意:只能呼叫一次)
                this.event.fsm.go(GameState.FGMultipleHandle, fsmProxy.fsmEvent(GameFacade.FGMULTIPLE_HANDLE, SignalAction.FG.MultipleHandle));
            } else {
                // this.event.fsm.go(GameState.FGShowWin, fsmProxy.fsmEvent(null, SignalAction.FG.Win));
                // FG局數是否達到上限
                const isFGRoundComplete = slotProxy.isFGRoundComplete();
                if (isFGRoundComplete) {
                    //切換到FGShowWin
                    const scoreProxy = this.event.facade.retrieveProxy(ScoreProxy.NAME) as ScoreProxy;
                    this.event.facade.sendNotification("SET_SCORE_VALUE_TransitionComponent", scoreProxy.GetScore);
                    this.event.fsm.go(GameState.FGShowWin, fsmProxy.fsmEvent(null, SignalAction.FG.ShowWin));
                } else {
                    //切換到FGWait
                    this.event.fsm.go(GameState.FGWait, fsmProxy.fsmEvent());
                }
            }
        }
    }
}


