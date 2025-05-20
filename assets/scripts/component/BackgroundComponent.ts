import { _decorator, Component, dragonBones, Label, Node } from 'cc';
import { AddSignal, SignalManager } from '../singleton/SignalManager';
import { SignalType } from '../Definition';
import { ISignal } from './Signal';
import { MultipleInfo, RemoveSymbolRule } from '../mvc/model/SlotProxy';
const { ccclass, property } = _decorator;

@ccclass('BackgroundComponent')
export class BackgroundComponent extends Component {

    @property(Node)
    private ngBackground: Node = null;

    @property(Node)
    private fgBackground: Node = null;

    @property(Node)
    private feature: Node = null;

    @property(Node)
    private triggerText: Node = null;

    @property(Node)
    private roundText: Node = null;

    @property(Label)
    private fgRound: Label = null;

    @property(dragonBones.ArmatureDisplay)
    private lubu: dragonBones.ArmatureDisplay = null;

    onLoad() {
        // this.lubu = this.node.getChildByName("LuBu").getComponent(dragonBones.ArmatureDisplay);
        AddSignal(SignalType.ShowLuBuFire, this.onShowLuBuFire.bind(this));
        AddSignal(SignalType.ShowNGBackground, this.onShowNGBackground.bind(this));
        AddSignal(SignalType.ShowFGBackground, this.onShowFGBackground.bind(this));
        AddSignal(SignalType.CloseNGBackground, this.onCloseNGBackground.bind(this));
        AddSignal(SignalType.CloseFGBackground, this.onCloseFGBackground.bind(this));
        AddSignal(SignalType.ShowFeature, this.onShowFeature.bind(this));
        AddSignal(SignalType.CloseFeature, this.onCloseFeature.bind(this));
        AddSignal(SignalType.ShowTriggerText, this.onShowTriggerText.bind(this));
        AddSignal(SignalType.CloseTriggerText, this.onCloseTriggerText.bind(this));
        AddSignal(SignalType.ShowFGRound, this.onShowFGRound.bind(this));
        AddSignal(SignalType.CloseFGRound, this.onCloseFGRound.bind(this));
        AddSignal(SignalType.ShowRoundText, this.onShowRoundText.bind(this));
        AddSignal(SignalType.CloseRoundText, this.onCloseRoundText.bind(this));
    }

    start() {

    }

    // private _multipleInfo: MultipleInfo = null;
    private _multiplePos: number[][] = [];
    /* public set SetMultipleInfo(data: MultipleInfo) {
        this._multipleInfo = data;
        console.log("!設定倍數資訊");
    } */

    private _removeSymbolRule: RemoveSymbolRule = null;
    public set SetRemoveSymbolRule(data: RemoveSymbolRule) {
        this._removeSymbolRule = data;
        // this._multipleInfo = data.multipleInfo;
        this._multiplePos = data.multipleInfo.pos;
    }

    public updateFGRound(round: number) {
        this.fgRound.string = round.toString();
    }

    public playLubuFire() {
        this.lubu.once(dragonBones.EventObject.COMPLETE, this.onLubuFireComplete, this);
        this.lubu.playAnimation("play", 1);
    }

    private onLubuFireComplete() {
        // 進入重複播放閒置動畫
        this.lubu.playAnimation("play_loop");
    }

    private onShowLuBuFire(event: ISignal) {
        // 倍數位置有內容時，代表要顯示呂布施法
        const isShowFireBall = this._multiplePos.some(pos => pos.length > 0);
        if (isShowFireBall) {
            this.lubu.once(dragonBones.EventObject.COMPLETE, this.onShowLubuFireComplete, this);
            this.lubu.playAnimation("play", 1);
        } else {
            // console.warn("不需要顯示動畫");
            event.CallBack();
        }
    }

    private onShowLubuFireComplete() {
        // 進入重複播放閒置動畫
        this.lubu.playAnimation("play_loop");
        SignalManager.CallBack(SignalType[SignalType.ShowLuBuFire]);
    }

    private onShowNGBackground(event: ISignal) {
        this.ngBackground.active = true;
        event.CallBack();
    }

    private onShowFGBackground(event: ISignal) {
        this.fgBackground.active = true;
        event.CallBack();
    }

    private onCloseNGBackground(event: ISignal) {
        this.ngBackground.active = false;
        event.CallBack();
    }

    private onCloseFGBackground(event: ISignal) {
        this.fgBackground.active = false;
        event.CallBack();
    }

    private onShowFeature(event: ISignal) {
        this.feature.active = true;
        event.CallBack();
    }

    private onCloseFeature(event: ISignal) {
        this.feature.active = false;
        event.CallBack();
    }

    private onShowTriggerText(event: ISignal) {
        this.triggerText.active = true;
        event.CallBack();
    }

    private onCloseTriggerText(event: ISignal) {
        this.triggerText.active = false;
        event.CallBack();
    }

    private onShowFGRound(event: ISignal) {
        this.fgRound.node.active = true;
        event.CallBack();
    }

    private onCloseFGRound(event: ISignal) {
        this.fgRound.node.active = false;
        event.CallBack();
    }

    private onShowRoundText(event: ISignal) {
        this.roundText.active = true;
        event.CallBack();
    }

    private onCloseRoundText(event: ISignal) {
        this.roundText.active = false;
        event.CallBack();
    }

    update(deltaTime: number) {

    }

}