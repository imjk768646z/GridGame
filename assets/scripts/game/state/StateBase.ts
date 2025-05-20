import IState from "../interface/IState";
import { GameState } from "../state/GameState";
import { IFSMEvent } from "../../mvc/model/FSMProxy";
import { SignalSchedule } from "../../singleton/SignalSchedule";

export class StateBase implements IState<GameState> {
    private _lastState: GameState = null;

    public get lastState() {
        return this._lastState;
    }

    private _event: IFSMEvent = null;

    public get event() {
        return this._event;
    }

    //can enter or not
    public onEnter(from?: GameState, event?: IFSMEvent): boolean {
        console.error(`${(this as any).constructor.name} onEnter from ${from}`);
        return false;
    }

    public on(from?: GameState, event?: IFSMEvent) {
        console.log("[FSM] Enter ", GameState[event.fsm.currentState]);
        this._lastState = from;
        this._event = event;
        // this.resetModel();

        // 切換狀態
        // event.view.updateViewState(event.fsm.currentState); //todo:按鈕組件需要透過它來更新狀態

        //如果有命令 一律先執行
        if (event.command != null) event.facade.sendNotification(event.command);

        // 是否執行
        if (event.signal != null) {
            SignalSchedule.Instance.SetSchedule(event.signal).Show();  // 觸發動畫排程
        }
    }

    //can exit or not
    public onExit(from?: GameState, event?: IFSMEvent): boolean {
        console.log("default fsm onExit");
        return true;
    }

    call() {
        console.log("default fsm call");
    }

    resetModel() {
        console.log("default reset model");
    }
}
