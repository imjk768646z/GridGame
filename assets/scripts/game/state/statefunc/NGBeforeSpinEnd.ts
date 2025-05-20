import { IFSMEvent } from "../../../mvc/model/FSMProxy";
import { SlotProxy, SpinReelRule } from "../../../mvc/model/SlotProxy";
import { StateBase } from "../StateBase";
import { GameState } from "../GameState";

export class NGBeforeSpinEnd extends StateBase {
    onEnter(from?: GameState, event?: IFSMEvent): boolean {
        console.log("NGBeforeSpinEnd onEnter");
        return true;
    }

    on(from?: GameState, event?: IFSMEvent) {
        super.on(from, event);
        console.log("NGBeforeSpinEnd on");
    }

    /* onExit(from?: GameState, event?: any) {
        console.log("NGBeforeSpinEnd onExit");
        return true;
    } */

    call(): void {
        console.log("動畫結束");
    }
}


