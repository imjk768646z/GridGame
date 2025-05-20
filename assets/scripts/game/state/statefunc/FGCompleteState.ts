import { FSMProxy, IFSMEvent } from "../../../mvc/model/FSMProxy";
import { SlotProxy } from "../../../mvc/model/SlotProxy";
import { StateBase } from "../StateBase";
import { GameState } from "../GameState";
import { GameFacade } from "../../../GameFacade";
import { SignalAction } from "../../../Definition";

export class FGCompleteState extends StateBase {
    onEnter(from?: GameState, event?: IFSMEvent): boolean {
        console.log("FGCompleteState onEnter");
        return true;
    }

    on(from?: GameState, event?: IFSMEvent) {
        super.on(from, event);
        console.log("FGCompleteState on");
        const slotProxy = event.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;

    }

    /* onExit(from?: GameState, event?: any) {
        console.log("FGCompleteState onExit");
        return true;
    } */

    call(): void {
        console.log("動畫結束");
        const fsmProxy = this.event.facade.retrieveProxy(FSMProxy.NAME) as FSMProxy;
        // const slotProxy = this.event.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;
        // slotProxy.resetFG();
        this.event.fsm.go(GameState.Wait, fsmProxy.fsmEvent(GameFacade.WAIT));
    }
}


