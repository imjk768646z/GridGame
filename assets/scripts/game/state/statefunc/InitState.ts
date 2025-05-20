import { FSMProxy, IFSMEvent } from "../../../mvc/model/FSMProxy";
import { SlotProxy } from "../../../mvc/model/SlotProxy";
import { StateBase } from "../StateBase";
import { GameState } from "../GameState";

export class InitState extends StateBase {
    onEnter(from?: GameState, event?: IFSMEvent): boolean {
        console.log("InitState onEnter");
        return true;
    }

    on(from?: GameState, event?: IFSMEvent) {
        super.on(from, event);
        console.log("InitState on");
    }

    /* onExit(from?: GameState, event?: any) {
        console.log("WaitState onExit");
        return true;
    } */

    call(): void {
        console.log("動畫結束");
        //todo: 切換到WaitState
        const fsmProxy = this.event.facade.retrieveProxy(FSMProxy.NAME) as FSMProxy;
        this.event.fsm.go(GameState.Wait, fsmProxy.fsmEvent());
    }
}


