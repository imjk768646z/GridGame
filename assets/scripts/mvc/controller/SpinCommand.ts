import { SignalAction } from '../../Definition';
import { GameState } from '../../game/state/GameState';
import { INotification, SimpleCommand } from '../../puremvc-typescript-standard-framework';
import { FSMProxy } from '../model/FSMProxy';
import { SlotProxy } from '../model/SlotProxy';

//todo: spin command沒有用到  之後考慮刪除
export class SpinCommand extends SimpleCommand {
    public execute(notification: INotification): void {
        const slotProxy = this.facade.retrieveProxy(SlotProxy.NAME) as SlotProxy;
        // slotProxy.startSpin();

        // 發送通知讓所有滾輪開始轉動
        // this.sendNotification("SPIN_NORMAL", slotProxy.startSpin());

        console.log("! execute SpinCommand")
        const fsmProxy = this.facade.retrieveProxy(FSMProxy.NAME) as FSMProxy;

        fsmProxy.fsm.go(GameState.Wait, fsmProxy.fsmEvent(null, SignalAction.NG.Test));
    }
}