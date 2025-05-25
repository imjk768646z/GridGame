import { FSMProxy, IFSMEvent } from "../../../mvc/model/FSMProxy";
import { SlotProxy } from "../../../mvc/model/SlotProxy";
import { StateBase } from "../StateBase";
import { GameState } from "../GameState";
import { GameFacade } from "../../../GameFacade";
import { SignalAction } from "../../../Definition";
import { ScoreProxy } from "../../../mvc/model/ScoreProxy";

export class FGFeaturePlayState extends StateBase {
    onEnter(from?: GameState, event?: IFSMEvent): boolean {
        console.log("FGFeaturePlayState onEnter");
        return true;
    }

    on(from?: GameState, event?: IFSMEvent) {
        super.on(from, event);
        console.log("FGFeaturePlayState on");

        const fsmProxy = this.event.facade.retrieveProxy(FSMProxy.NAME) as FSMProxy;
        const slotProxy = event.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;
        //判斷是否進入消除狀態
        const hasFGRemoveInfo = slotProxy.hasFGRemoveInfo();
        if (hasFGRemoveInfo) {
            //切換到消除狀態
            event.fsm.go(GameState.FGRemove, fsmProxy.fsmEvent(GameFacade.FGREMOVE, SignalAction.FG.Remove));
            return;
        }

        // FG局數是否達到上限
        const isFGRoundComplete = slotProxy.isFGRoundComplete();
        if (isFGRoundComplete) {
            //切換到FGShowWin
            const scoreProxy = event.facade.retrieveProxy(ScoreProxy.NAME) as ScoreProxy;
            this.event.facade.sendNotification("SET_SCORE_VALUE_TransitionComponent", scoreProxy.GetScore);
            event.fsm.go(GameState.FGShowWin, fsmProxy.fsmEvent(null, SignalAction.FG.ShowWin));
        } else {
            //切換到FGWait
            event.fsm.go(GameState.FGWait, fsmProxy.fsmEvent());
        }
    }

    /* onExit(from?: GameState, event?: any) {
        console.log("FGFeaturePlayState onExit");
        return true;
    } */

    call(): void {
        console.log("動畫結束");
    }
}


