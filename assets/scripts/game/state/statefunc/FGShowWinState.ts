import { FSMProxy, IFSMEvent } from "../../../mvc/model/FSMProxy";
import { SlotProxy } from "../../../mvc/model/SlotProxy";
import { StateBase } from "../StateBase";
import { GameState } from "../GameState";
import { GameFacade } from "../../../GameFacade";
import { SignalAction } from "../../../Definition";

export class FGShowWinState extends StateBase {
    onEnter(from?: GameState, event?: IFSMEvent): boolean {
        console.log("FGShowWinState onEnter");
        return true;
    }

    on(from?: GameState, event?: IFSMEvent) {
        super.on(from, event);
        console.log("FGShowWinState on");

        
    }

    /* onExit(from?: GameState, event?: any) {
        console.log("FGShowWinState onExit");
        return true;
    } */

    call(): void {
        console.log("動畫結束");

        const fsmProxy = this.event.facade.retrieveProxy(FSMProxy.NAME) as FSMProxy;
        this.event.fsm.go(GameState.FGComplete, fsmProxy.fsmEvent(null, SignalAction.FG.AllComplete));
    }
}


