import { FSMProxy, IFSMEvent } from "../../../mvc/model/FSMProxy";
import { SlotProxy } from "../../../mvc/model/SlotProxy";
import { StateBase } from "../StateBase";
import { GameState } from "../GameState";
import { GameFacade } from "../../../GameFacade";
import { SignalAction } from "../../../Definition";
import { MultipleProxy } from "../../../mvc/model/MultipleProxy";
import { ScoreProxy } from "../../../mvc/model/ScoreProxy";

export class FGMultipleHandleState extends StateBase {
    onEnter(from?: GameState, event?: IFSMEvent): boolean {
        console.log("FGMultipleHandleState onEnter");
        return true;
    }

    on(from?: GameState, event?: IFSMEvent) {
        super.on(from, event);
        console.log("FGMultipleHandleState on");
        const slotProxy = event.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;

    }

    /* onExit(from?: GameState, event?: any) {
        console.log("FGMultipleHandleState onExit");
        return true;
    } */

    call(): void {
        console.log("動畫結束");
        const fsmProxy = this.event.facade.retrieveProxy(FSMProxy.NAME) as FSMProxy;
        const slotProxy = this.event.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;
        const multipleProxy = this.event.facade.retrieveProxy(MultipleProxy.NAME) as MultipleProxy;

        // 取得MultipleProxy 試問有無下一個倍數要處理
        if (multipleProxy.hasNextMultipleSymbol()) {
            this.event.fsm.go(GameState.FGMultipleHandle, fsmProxy.fsmEvent(GameFacade.FGMULTIPLE_HANDLE, SignalAction.FG.MultipleHandle));
        } else {
            // FG局數是否達到上限
            const isFGRoundComplete = slotProxy.isFGRoundComplete();
            if (isFGRoundComplete) {
                console.log("切換到FGShowWin");
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


