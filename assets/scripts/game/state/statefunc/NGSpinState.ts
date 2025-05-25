import { IFSMEvent } from "../../../mvc/model/FSMProxy";
import { SlotProxy, SpinReelRule } from "../../../mvc/model/SlotProxy";
import { StateBase } from "../StateBase";
import { GameState } from "../GameState";

export class NGSpinState extends StateBase {
    onEnter(from?: GameState, event?: IFSMEvent): boolean {
        console.log("NGSpinState onEnter");
        return true;
    }

    on(from?: GameState, event?: IFSMEvent) {
        super.on(from, event);
        console.log("NGSpinState on");

        // const Body = { callback: this.onGainSpinResult.bind(this) };
        event.facade.sendNotification("SPIN_OUT", this.onGainSpinResult.bind(this));
    }

    /* onExit(from?: GameState, event?: any) {
        console.log("NGSpinState onExit");
        return true;
    } */

    call(): void {
        console.log("動畫結束");
    }

    // 所有滾輪往下移出畫面後回呼
    private async onGainSpinResult() {
        console.log("取得資料SlotProxy");
        // 轉入前先重置滾輪中圖標的狀態
        this.event.facade.sendNotification("RESET_REEL");
        const slotProxy = this.event.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;
        // const Result = await slotProxy.spinResult();
        // this.event.facade.sendNotification("SPIN_IN", Result);


        // 新盤面有出現S系列圖標代表有倍數獎勵 先播放呂布動畫 再轉動滾輪同時播放S圖標的火焰動畫 之後進行消除圖標
        // 先檢查有沒有multipleInfo 如果不為空 先做動畫
        const spinReelData = slotProxy.GetSpinReelData as SpinReelRule;
        console.log("! 目前獲得的新滾輪資訊 有無倍數獎勵:", spinReelData);

        // if (spinReelData.multipleInfo != undefined) {
        if (slotProxy.hasMultipInfoBeforeRemove) {
            console.log("播放呂布動畫以及執行SPIN_IN");
            this.event.facade.sendNotification("LUBU_FIRE");
            this.event.facade.sendNotification("SET_MULTIPLE_TEXT", spinReelData.multipleInfo);
            const Result = await slotProxy.getSpinUpdateReelData();
            this.event.facade.sendNotification("SPIN_IN", Result);
            //播放火焰動畫，指定到正確的symbol位置
            this.event.facade.sendNotification("FIRE_BALL", spinReelData.multipleInfo.pos);
        } else {
            console.log("僅執行SPIN_IN");
            const Result = await slotProxy.getSpinUpdateReelData();
            this.event.facade.sendNotification("SPIN_IN", Result);
        }


        // 消除後有出現S系列圖標代表有倍數獎勵 先播放呂布動畫 再讓新的圖標掉落時播放S圖標的火焰動畫

        // 如果有倍數獎勵 使用通知先做呂布動畫
    }

    private onLubuFireComplete() {
        // this.event.facade.sendNotification("SPIN_IN", Result);
    }
}


