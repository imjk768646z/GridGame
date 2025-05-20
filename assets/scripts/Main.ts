import { _decorator, Component, Node } from 'cc';
import { GameFacade } from './GameFacade';
import fsm from './kernel/utility/fsm.min.cjs';
import { GameState } from './game/state/GameState';
import { SignalScheduleParam } from './singleton/SignalSchedule';
import { IFSMEvent } from './mvc/model/FSMProxy';
import { SignalAction, SignalType } from './Definition';
import { GameScene } from './GameScene';
import { LoadScene } from './LoadScene';
import { AddSignal } from './singleton/SignalManager';
import { ISignal } from './component/Signal';
import { ButtonComponent } from './component/ButtonComponent';
import { BackgroundComponent } from './component/BackgroundComponent';
import { EffectComponent } from './component/EffectComponent';
import { EliminateScoreComponent } from './component/EliminateScoreComponent';
import { MainInformationComponent } from './component/MainInformationComponent';
import { BetProxy } from './mvc/model/BetProxy';
import { TransitionComponent } from './component/TransitionComponent';

const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    @property(GameScene)
    private gameScene: GameScene = null;

    @property(LoadScene)
    private loadScene: LoadScene = null;

    @property(ButtonComponent)
    private buttonComponent = null;

    @property(BackgroundComponent)
    private backgroundComponent = null;

    @property(EffectComponent)
    private effectComponent = null;

    @property(EliminateScoreComponent)
    private eliminateScoreComponent = null;

    @property(MainInformationComponent)
    private mainInformationComponent = null;

    @property(TransitionComponent)
    private transitionComponent = null;

    private gameFacade: GameFacade = null;
    private fsm: fsm.FiniteStateMachine<GameState> = new fsm.FiniteStateMachine<GameState>(GameState.None, true);

    onLoad() {
        this.gameFacade = GameFacade.getInstance() as GameFacade;
        this.gameScene.node.active = false;

        AddSignal(SignalType.EnableGameScene, this.onEnableGameScene.bind(this));
        AddSignal(SignalType.HideLoading, this.onHideLoading.bind(this));
        AddSignal(SignalType.GotoNG, this.onShowNGScene.bind(this));
    }

    start() {
        this.init();
    }

    public fsmEvent(command?: string, signal?: SignalScheduleParam) {
        var ref = <IFSMEvent>{};
        ref.fsm = this.fsm;
        ref.command = command;
        ref.signal = signal;
        ref.facade = this.gameFacade;
        return ref;
    }

    private init() {
        this.gameScene.SetFSM = this.fsm;
        this.buttonComponent.init(this);
        this.gameFacade.startup(this);
        this.loadScene.node.active = true;
        // 切換狀態機有指定動畫 會先在狀態腳本執行on   再執行call(有動畫時請確保已具備相關資料，使用通知做事先設定)
        // 切換狀態機無指定動畫 會先在狀態腳本執行call 再執行on
        this.fsm.go(GameState.Load, this.fsmEvent());
    }

    private onEnableGameScene(event: ISignal) {
        this.gameScene.node.active = true;
        event.CallBack();
    }

    private onHideLoading(event: ISignal) {
        this.loadScene.node.active = false;
        event.CallBack();
    }

    private onShowNGScene(event: ISignal) {
        this.gameScene.init();
        this.gameFacade.sendNotification("SAVED_SYMBOL_POS");
        this.gameFacade.sendNotification("SAVED_ELIMINATESCORE_POS");
        event.CallBack();
    }

    private onSpin() {
        console.log("! 切換到SpinState");
        this.fsm.go(GameState.NGSpin, this.fsmEvent(null, SignalAction.NG.SpinStart));
    }

    private onStop() {
        this.gameScene.GetReelControl.spinStop();
    }

    private onRaise() {
        const betProxy = this.gameFacade.retrieveProxy(BetProxy.NAME) as BetProxy;
        this.mainInformationComponent.updateTotalBet(betProxy.raiseBet());
    }

    private onReduce() {
        const betProxy = this.gameFacade.retrieveProxy(BetProxy.NAME) as BetProxy;
        this.mainInformationComponent.updateTotalBet(betProxy.reduceBet());
    }

    update(deltaTime: number) {

    }
}


