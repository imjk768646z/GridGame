import { FSMProxy, IFSMEvent } from "../../../mvc/model/FSMProxy";
import { SlotProxy } from "../../../mvc/model/SlotProxy";
import { StateBase } from "../StateBase";
import { GameState } from "../GameState";
import { GameFacade } from "../../../GameFacade";
import { SignalAction, SoundList } from "../../../Definition";
import { AudioEngineControl } from "../../../singleton/AudioEngineControl";

export class FeaturePlayState extends StateBase {
    onEnter(from?: GameState, event?: IFSMEvent): boolean {
        console.log("FeaturePlayState onEnter");
        return true;
    }

    on(from?: GameState, event?: IFSMEvent) {
        super.on(from, event);
        console.log("FeaturePlayState on");

        const fsmProxy = this.event.facade.retrieveProxy(FSMProxy.NAME) as FSMProxy;
        const slotProxy = event.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;

        //先判斷有無免費遊戲，才判斷有無消除
        if (slotProxy.hasFG()) {
            console.log("###進入FGTrigger");
            AudioEngineControl.getInstance().playAudio(SoundList.FGTriggerBG, 1);
            event.fsm.go(GameState.FGTrigger, fsmProxy.fsmEvent(GameFacade.FGTRIGGER, SignalAction.FG.TriggerFG));
            return;
        }

        //判斷是否進入消除狀態
        const hasRemoveInfo = slotProxy.hasRemoveInfo();
        if (hasRemoveInfo) {
            //切換到消除狀態
            event.fsm.go(GameState.Remove, fsmProxy.fsmEvent(GameFacade.REMOVE, SignalAction.NG.Remove));
        } else {
            event.fsm.go(GameState.NGComplete, fsmProxy.fsmEvent(null, SignalAction.NG.AllComplete));
        }
    }

    /* onExit(from?: GameState, event?: any) {
        console.log("FeaturePlayState onExit");
        return true;
    } */

    call(): void {
        console.log("動畫結束");
    }
}


