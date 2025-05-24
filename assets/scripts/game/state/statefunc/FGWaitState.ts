import { FSMProxy, IFSMEvent } from "../../../mvc/model/FSMProxy";
import { SlotProxy } from "../../../mvc/model/SlotProxy";
import { StateBase } from "../StateBase";
import { GameState } from "../GameState";
import { GameFacade } from "../../../GameFacade";
import { SignalAction } from "../../../Definition";

export class FGWaitState extends StateBase {
    onEnter(from?: GameState, event?: IFSMEvent): boolean {
        console.log("FGWaitState onEnter");
        return true;
    }

    on(from?: GameState, event?: IFSMEvent) {
        super.on(from, event);
        console.log("FGWaitState on");
        const slotProxy = event.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;
        event.facade.sendNotification("UPDATE_FG_ROUND", slotProxy.GetRestOfFGRound);
        const fsmProxy = event.facade.retrieveProxy(FSMProxy.NAME) as FSMProxy;
        setTimeout(() => {
            event.fsm.go(GameState.FGSpin, fsmProxy.fsmEvent(null, SignalAction.FG.BeforeSpin));
        }, 500);
    }

    /* onExit(from?: GameState, event?: any) {
        console.log("FGWaitState onExit");
        return true;
    } */

    call(): void {
        console.log("動畫結束");
    }
}


