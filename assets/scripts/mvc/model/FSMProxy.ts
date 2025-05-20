import { Facade, Proxy } from "../../puremvc-typescript-standard-framework";
import fsm from '../../kernel/utility/fsm.min.cjs';
import { GameState } from "../../game/state/GameState";
import IState from "../../game/interface/IState";
import { WaitState } from "../../game/state/statefunc/WaitState";
import { SignalSchedule, SignalScheduleParam } from "../../singleton/SignalSchedule";
import { SignalType } from "../../Definition";
import { LoadState } from "../../game/state/statefunc/LoadState";
import { InitState } from "../../game/state/statefunc/InitState";
import { NGSpinState } from "../../game/state/statefunc/NGSpinState";
import { FeaturePlayState } from "../../game/state/statefunc/FeaturePlayState";
import { RemoveState } from "../../game/state/statefunc/RemoveState";
import { MultipleHandleState } from "../../game/state/statefunc/MultipleHandleState";
import { NGShowWinState } from "../../game/state/statefunc/NGShowWinState";
import { NGCompleteState } from "../../game/state/statefunc/NGCompleteState";
import { FGTriggerState } from "../../game/state/statefunc/FGTriggerState";
import { FGWaitState } from "../../game/state/statefunc/FGWaitState";
import { FGSpinState } from "../../game/state/statefunc/FGSpinState";
import { FGFeaturePlayState } from "../../game/state/statefunc/FGFeaturePlayState";
import { FGRemoveState } from "../../game/state/statefunc/FGRemoveState";
import { FGMultipleHandleState } from "../../game/state/statefunc/FGMultipleHandleState";
import { FGShowWinState } from "../../game/state/statefunc/FGShowWinState";
import { FGCompleteState } from "../../game/state/statefunc/FGCompleteState";

export class FSMProxy extends Proxy {
    public static NAME: string = "FSMProxy";
    public fsm: fsm.FiniteStateMachine<GameState> = null;
    private _fsmEvent: Function = null;
    public fsmState: Map<GameState, IState<GameState>> = new Map<GameState, IState<GameState>>();

    constructor(main: any) {
        super(FSMProxy.NAME);
        this.fsm = main.fsm;
        this._fsmEvent = main.fsmEvent.bind(main);
    }

    public onRegister(): void {
        this.initFsm();
        this.fsmBind();
        this.initSignal();
    }

    public fsmEvent(command?: string, signal?: SignalScheduleParam) {
        return this._fsmEvent(command, signal);
    }

    private initFsm() {
        // 設定流程
        this.fsm.from(GameState.None).to(GameState.Load);
        this.fsm.from(GameState.Load).to(GameState.Init);
        this.fsm.from(GameState.Init).to(GameState.Wait);

        // NG流程
        this.fsm.from(GameState.Wait).to(GameState.NGSpin);
        this.fsm.from(GameState.NGSpin).to(GameState.FeaturePlay);
        this.fsm.from(GameState.FeaturePlay).to(GameState.Remove);
        this.fsm.from(GameState.FeaturePlay).to(GameState.NGComplete);
        this.fsm.from(GameState.Remove).to(GameState.MultipleHandle);
        this.fsm.from(GameState.Remove).to(GameState.NGShowWin);
        this.fsm.from(GameState.MultipleHandle).to(GameState.NGShowWin);
        this.fsm.from(GameState.NGShowWin).to(GameState.NGComplete);
        this.fsm.from(GameState.NGComplete).to(GameState.Wait);
        
        // FG流程
        this.fsm.from(GameState.FeaturePlay).to(GameState.FGTrigger);
        this.fsm.from(GameState.FGTrigger).to(GameState.FGWait);
        this.fsm.from(GameState.FGWait).to(GameState.FGSpin);
        this.fsm.from(GameState.FGSpin).to(GameState.FGFeaturePlay);
        this.fsm.from(GameState.FGFeaturePlay).to(GameState.FGRemove);
        this.fsm.from(GameState.FGFeaturePlay).to(GameState.FGShowWin);
        this.fsm.from(GameState.FGRemove).to(GameState.FGMultipleHandle);
        this.fsm.from(GameState.FGRemove).to(GameState.FGShowWin);
        this.fsm.from(GameState.FGMultipleHandle).to(GameState.FGShowWin);
        this.fsm.from(GameState.FGMultipleHandle).to(GameState.FGWait);
        this.fsm.from(GameState.FGShowWin).to(GameState.FGComplete);
        this.fsm.from(GameState.FGComplete).to(GameState.Wait);

        // 設定腳本
        this.fsmState.set(GameState.Load, new LoadState());
        this.fsmState.set(GameState.Init, new InitState());
        this.fsmState.set(GameState.Wait, new WaitState());
        this.fsmState.set(GameState.NGSpin, new NGSpinState());
        this.fsmState.set(GameState.FeaturePlay, new FeaturePlayState());
        this.fsmState.set(GameState.Remove, new RemoveState());
        this.fsmState.set(GameState.MultipleHandle, new MultipleHandleState());
        this.fsmState.set(GameState.NGShowWin, new NGShowWinState());
        this.fsmState.set(GameState.NGComplete, new NGCompleteState());
        this.fsmState.set(GameState.FGTrigger, new FGTriggerState());
        this.fsmState.set(GameState.FGWait, new FGWaitState());
        this.fsmState.set(GameState.FGSpin, new FGSpinState());
        this.fsmState.set(GameState.FGFeaturePlay, new FGFeaturePlayState());
        this.fsmState.set(GameState.FGRemove, new FGRemoveState());
        this.fsmState.set(GameState.FGMultipleHandle, new FGMultipleHandleState());
        this.fsmState.set(GameState.FGShowWin, new FGShowWinState());
        this.fsmState.set(GameState.FGComplete, new FGCompleteState());
    }

    private fsmBind() {
        this.fsmState.forEach((value, key) => {
            this.fsm.onEnter(key, value.onEnter.bind(value));
            this.fsm.on(key, value.on.bind(value));
            this.fsm.onExit(key, value.onExit.bind(value));
        })
    }

    private initSignal() {
        SignalSchedule.IsOpenLog = true;
        SignalSchedule.SetKeys = SignalType;
        SignalSchedule.addScheduleComplete = () => {
            let state = this.fsm.currentState;
            if (this.fsmState.get(state)) {
                this.fsmState.get(state).call();
            }
        };
    }
}

export interface IFSMEvent {
    /**
     * 狀態機
     */
    fsm: fsm.FiniteStateMachine<GameState>;
    /**
     * Command名稱
     */
    command?: string;
    /**
     * 動畫事件
     * @see SignalSchedule
     */
    signal?: SignalScheduleParam;
    /**
     * PureMVC核心
     */
    facade: Facade;
    /**
     * 畫面控制
     */
    // view: ViewSystem; //todo: 加入ViewSystem
}
