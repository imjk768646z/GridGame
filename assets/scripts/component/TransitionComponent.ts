import { _decorator, Component, dragonBones, Label, Node, NodeEventType } from 'cc';
import { AddSignal, SignalManager } from '../singleton/SignalManager';
import { SignalType, SoundList } from '../Definition';
import { ISignal } from './Signal';
import { AudioEngineControl } from '../singleton/AudioEngineControl';
const { ccclass, property } = _decorator;

@ccclass('TransitionComponent')
export class TransitionComponent extends Component {

    @property(Node)
    private fgTrigger: Node = null;

    @property(Node)
    private fgShowWin: Node = null;

    @property(dragonBones.ArmatureDisplay)
    private transition: dragonBones.ArmatureDisplay = null;

    onLoad() {
        this.fgTrigger.on(NodeEventType.TOUCH_START, this.onShowFGTransition, this);
        AddSignal(SignalType.ShowEnterFG, this.onShowEnterFG.bind(this));
        // AddSignal(SignalType.ShowFGTransition, this.onShowFGTransition.bind(this));
        AddSignal(SignalType.CloseEnterFG, this.onCloseEnterFG.bind(this));
        AddSignal(SignalType.CloseFGTransition, this.onCloseFGTransition.bind(this));
        AddSignal(SignalType.ShowFGShowWin, this.onShowFGShowWin.bind(this));
        AddSignal(SignalType.CloseFGShowWin, this.onCloseFGShowWin.bind(this));
    }

    start() {
        this.node.active = false;
    }

    private _fgTotalRound: number;
    public set SetFGTotalRound(round: number) {
        this._fgTotalRound = round;
    }

    private _scoreToShow: number = 0;
    public set SetScoreToShow(score: number) {
        this._scoreToShow = score;
    }

    private onShowEnterFG(event: ISignal) {
        this.node.active = true;
        this.fgTrigger.active = true;
        this.fgTrigger.getChildByName("text").getChildByName("round").getComponent(Label).string = this._fgTotalRound.toString();
        event.CallBack();
    }

    private onShowFGTransition() {
        AudioEngineControl.getInstance().playAudio(SoundList.FreeGameTransform, 1);
        this.transition.node.active = true;
        this.transition.once(dragonBones.EventObject.COMPLETE, this.onShowFGTransitionComplete, this);
        this.transition.playAnimation("play", 1);
    }

    private onShowFGTransitionComplete() {
        SignalManager.CallBack(SignalType[SignalType.ShowFGTransition]);
    }

    private onCloseEnterFG(event: ISignal) {
        this.node.active = false;
        this.fgTrigger.active = false;
        event.CallBack();
    }

    private onCloseFGTransition(event: ISignal) {
        this.transition.node.active = false;
        event.CallBack();
    }

    private onShowFGShowWin(event: ISignal) {
        this.node.active = true;
        this.fgShowWin.active = true;
        this.fgShowWin.getChildByName("text").getChildByName("winScore").getComponent(Label).string = this._scoreToShow.toString();

        setTimeout(() => {
            event.CallBack();
        }, 2000);
    }

    private onCloseFGShowWin(event: ISignal) {
        this.node.active = false;
        this.fgShowWin.active = false;
        event.CallBack();
    }

    update(deltaTime: number) {

    }
}


