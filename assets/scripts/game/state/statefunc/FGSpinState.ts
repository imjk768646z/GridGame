import { FSMProxy, IFSMEvent } from "../../../mvc/model/FSMProxy";
import { SlotProxy, SpinReelRule } from "../../../mvc/model/SlotProxy";
import { StateBase } from "../StateBase";
import { GameState } from "../GameState";
import { GameFacade } from "../../../GameFacade";
import { SignalAction } from "../../../Definition";

export class FGSpinState extends StateBase {
    onEnter(from?: GameState, event?: IFSMEvent): boolean {
        console.log("FGSpinState onEnter");
        return true;
    }

    on(from?: GameState, event?: IFSMEvent) {
        super.on(from, event);
        console.log("FGSpinState on");
        /* const slotProxy = event.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;
        event.facade.sendNotification("SPIN_OUT", this.onGainSpinResult.bind(this)); */
    }

    /* onExit(from?: GameState, event?: any) {
        console.log("FGSpinState onExit");
        return true;
    } */

    call(): void {
        console.log("動畫結束");

        this.event.facade.sendNotification("SPIN_OUT", this.onGainSpinResult.bind(this));
    }

    // 所有滾輪往下移出畫面後回呼
    private async onGainSpinResult() {
        // 轉入前先重置滾輪中圖標的狀態
        this.event.facade.sendNotification("RESET_REEL");
        const slotProxy = this.event.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;
        const spinReelData = slotProxy.GetFGSpinReelData as SpinReelRule;

        if (slotProxy.hasMultipInfoBeforeFGRemove) { //播放呂布動畫以及執行SPIN_IN
            this.event.facade.sendNotification("LUBU_FIRE");
            this.event.facade.sendNotification("SET_MULTIPLE_TEXT", spinReelData.multipleInfo);
            const Result = await slotProxy.getFGSpinUpdateReelData();
            this.event.facade.sendNotification("SPIN_IN", Result);
            //播放火焰動畫，指定到正確的symbol位置
            this.event.facade.sendNotification("FIRE_BALL", spinReelData.multipleInfo.pos);
        } else { //僅執行SPIN_IN
            const Result = await slotProxy.getFGSpinUpdateReelData();
            this.event.facade.sendNotification("SPIN_IN", Result);
        }
    }
}


