import { _decorator, Button, Color, Component, dragonBones, Label, Node, NodeEventType, Sprite, tween, Vec3 } from 'cc';
import { GameFacade } from './GameFacade';
import { ReelBar } from './component/ReelBar';
import fsm from './kernel/utility/fsm.min.cjs';
import { GameState } from './game/state/GameState';
import { FSMProxy, IFSMEvent } from './mvc/model/FSMProxy';
import { SignalScheduleParam } from './singleton/SignalSchedule';
import { AddSignal } from './singleton/SignalManager';
import { SignalType } from './Definition';
import { ISignal } from './component/Signal';
import { ReelControl } from './component/ReelControl';
import { AudioEngineControl } from './singleton/AudioEngineControl';

const { ccclass, property } = _decorator;

/**
 * 主要是讓狀態機觸發的動畫排程能夠直接調用這裡的方法
 * 其餘由玩家觸發的互動則由通知(Notificatjion)實現
 */
@ccclass('GameScene')
export class GameScene extends Component {

    @property(ReelControl)
    private reelControl: ReelControl = null;

    private testButton: Node = null; //測試專用按鈕
    private reelBar: ReelBar = null; //滾輪
    private fsm: fsm.FiniteStateMachine<GameState> = null;

    //取得ReelControl實例

    // private gameFacade: GameFacade = null
    // private fsm: fsm.FiniteStateMachine<GameState> = new fsm.FiniteStateMachine<GameState>(GameState.Wait, true);
    private symbol: dragonBones.ArmatureDisplay = null;

    init() {
        // 初始化所有介面 包含滾輪
        this.reelControl.init();
    }

    public set SetFSM(fsm: fsm.FiniteStateMachine<GameState>) {
        this.fsm = fsm;
    }

    start() {
        // temp test
        // this.symbol = this.node.getChildByName("SymbolExample").getComponent(dragonBones.ArmatureDisplay);
        // setTimeout(() => {
        //     this.symbol.playAnimation("play_A", 0);
        // }, 2000);
        this.testButton = this.node.getChildByName("Test");
        this.testButton.on(NodeEventType.TOUCH_START, this.onTest, this);
        // this.reelBar = this.node.getChildByName("ReelBar").getComponent(ReelBar);
        // this.reelBar.RollingCallBack = this.onReelRollingComplete.bind(this);

        this.reelControl.reelBars[this.reelControl.reelBars.length - 1].RollingCallBack = this.onReelRollingComplete.bind(this);

        // const gameFacade = GameFacade.getInstance() as GameFacade;
        // gameFacade.startup(this);
        // gameFacade.multiProcess();
        // this.gameFacade = GameFacade.getInstance() as GameFacade;
        // this.gameFacade.startup(this);

        // AddSignal(SignalType.Test, this.onTestSignal.bind(this));
    }

    onRemove() {
        this.reelBar.removeSymbol();
    }

    private mainIndex = 0;
    private multiplePos = [[], [5], [], [3]];
    async onTest() {
        this.testButton.getComponent(Button).interactable = false;
        /* const MutipleIndexList = [];
        for (let i = 0; i < this.multiplePos.length; i++) {
            if (this.multiplePos[i].length > 0) {
                MutipleIndexList.push(i);
            }
        }
         */

        /* this.reelControl.reelBars.forEach((reelBar, index) => {
            reelBar.showFrame(this.onShowFrameComplete, this);
        }) */


        /* const multiPromises: Promise<boolean>[] = [];
        for (let i = 0; i < 5; i++) {
            const p = new Promise<boolean>(async resovle => {
                await this.executeTween();
                resovle(true);
            })
            multiPromises.push(p);
        }

        await Promise.all(multiPromises)
            .then(() => {
                
            })
            .catch((err) => { console.error(err); }); */
    }

    //test 這裡要移置ReelControl實作
    private totalRemovedCount = 0;
    private onShowFrameComplete() {
        this.totalRemovedCount++;
        
        if (this.totalRemovedCount >= 10) {
            
        }
    }

    private onNextMission() {
        
    }

    private async executeTween() {
        //測試迴圈Promise
        const tweenPromises: Promise<Node>[] = [];
        for (let i = 0; i < 5; i++) {
            const p = new Promise<Node>(resovle => {
                tween(this.testButton)
                    .to(1, { scale: new Vec3(1.1 * i, 1.1 * i, 0) })
                    .call(() => {
                        
                        resovle(this.testButton);
                    })
                    .start();
            })
            tweenPromises.push(p);
        }

        await Promise.all(tweenPromises)
            .then(() => {
                this.onNextMission();
            })
            .catch((err) => { console.error(err); });

        
    }

    // 新滾輪全部出現在畫面後的回呼
    private onReelRollingComplete() {
        //切換狀態機到FeaturePlay/FGFeaturePlay 
        const Facade = GameFacade.getInstance() as GameFacade;
        const fsmProxy = Facade.retrieveProxy(FSMProxy.NAME) as FSMProxy;
        if (this.fsm.currentState == GameState.NGSpin) {
            this.fsm.go(GameState.FeaturePlay, fsmProxy.fsmEvent());
        } else if (this.fsm.currentState == GameState.FGSpin) {
            this.fsm.go(GameState.FGFeaturePlay, fsmProxy.fsmEvent());
        }
    }

    /* public fsmEvent(signal?: SignalScheduleParam) {
        var ref = <IFSMEvent>{};
        ref.fsm = this.fsm;
        ref.signal = signal;
        ref.facade = this.gameFacade;
        return ref;
    } */

    private onTestSignal(event: ISignal) {
        event.CallBack();
    }

    public get GetReelControl(): ReelControl {
        return this.reelControl;
    }

    public get ReelBarInstance(): ReelBar {
        return this.reelBar;
    }

    update(deltaTime: number) {

    }
}


