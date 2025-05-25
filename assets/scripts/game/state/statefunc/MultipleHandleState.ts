import { FSMProxy, IFSMEvent } from "../../../mvc/model/FSMProxy";
import { SlotProxy, SpinReelRule } from "../../../mvc/model/SlotProxy";
import { StateBase } from "../StateBase";
import { GameState } from "../GameState";
import { MultipleProxy } from "../../../mvc/model/MultipleProxy";
import { GameFacade } from "../../../GameFacade";
import { SignalAction } from "../../../Definition";

export class MultipleHandleState extends StateBase {
    onEnter(from?: GameState, event?: IFSMEvent): boolean {
        console.log("MultipleHandleState onEnter");
        return true;
    }

    on(from?: GameState, event?: IFSMEvent) {
        super.on(from, event);
        console.log("MultipleHandleState on");
    }

    /* onExit(from?: GameState, event?: any) {
        console.log("MultipleHandleState onExit");
        return true;
    } */

    call(): void {
        console.log("動畫結束");
        const fsmProxy = this.event.facade.retrieveProxy(FSMProxy.NAME) as FSMProxy;
        const multipleProxy = this.event.facade.retrieveProxy(MultipleProxy.NAME) as MultipleProxy;

        // 取得MultipleProxy 試問有無下一個倍數要處理
        if (multipleProxy.hasNextMultipleSymbol()) {
            this.event.fsm.go(GameState.MultipleHandle, fsmProxy.fsmEvent(GameFacade.MULTIPLE_HANDLE, SignalAction.NG.MultipleHandle));
        } else {
            this.event.fsm.go(GameState.NGShowWin, fsmProxy.fsmEvent(null, SignalAction.NG.Win));
        }
    }
}


