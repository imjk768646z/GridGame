import { FSMProxy, IFSMEvent } from "../../../mvc/model/FSMProxy";
import { SlotProxy, SpinReelRule } from "../../../mvc/model/SlotProxy";
import { StateBase } from "../StateBase";
import { GameState } from "../GameState";
import { SignalAction } from "../../../Definition";

export class NGShowWinState extends StateBase {
    onEnter(from?: GameState, event?: IFSMEvent): boolean {
        console.log("NGShowWinState onEnter");
        return true;
    }

    on(from?: GameState, event?: IFSMEvent) {
        super.on(from, event);
        console.log("NGShowWinState on");

        const fsmProxy = event.facade.retrieveProxy(FSMProxy.NAME) as FSMProxy;
        event.fsm.go(GameState.NGComplete, fsmProxy.fsmEvent(null, SignalAction.NG.AllComplete));
    }

    /* onExit(from?: GameState, event?: any) {
        console.log("NGShowWinState onExit");
        return true;
    } */

    call(): void {
        console.log("動畫結束");
    }
}


