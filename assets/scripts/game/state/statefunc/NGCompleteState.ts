import { FSMProxy, IFSMEvent } from "../../../mvc/model/FSMProxy";
import { SlotProxy, SpinReelRule } from "../../../mvc/model/SlotProxy";
import { StateBase } from "../StateBase";
import { GameState } from "../GameState";
import { GameFacade } from "../../../GameFacade";

export class NGCompleteState extends StateBase {
    onEnter(from?: GameState, event?: IFSMEvent): boolean {
        console.log("NGCompleteState onEnter");
        return true;
    }

    on(from?: GameState, event?: IFSMEvent) {
        super.on(from, event);
        console.log("NGCompleteState on");


    }

    /* onExit(from?: GameState, event?: any) {
        console.log("NGCompleteState onExit");
        return true;
    } */

    call(): void {
        console.log("動畫結束");

        const fsmProxy = this.event.facade.retrieveProxy(FSMProxy.NAME) as FSMProxy;
        // const slotProxy = this.event.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;
        // slotProxy.resetNG();
        this.event.fsm.go(GameState.Wait, fsmProxy.fsmEvent(GameFacade.WAIT));
    }
}


