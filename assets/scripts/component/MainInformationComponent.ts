import { _decorator, Component, Label, Node } from 'cc';
import { RemoveSymbolRule } from '../mvc/model/SlotProxy';
import { AddSignal } from '../singleton/SignalManager';
import { SignalType, SoundList } from '../Definition';
import { ISignal } from './Signal';
import { RunScore } from './RunScore';
import { AudioEngineControl } from '../singleton/AudioEngineControl';
const { ccclass, property } = _decorator;

@ccclass('MainInformationComponent')
export class MainInformationComponent extends Component {

    @property(Node)
    private credit: Node = null;

    @property(Node)
    private win: Node = null;

    @property(Node)
    private totalBet: Node = null;

    @property(Label)
    private creditNumber: Label = null;

    @property(Label)
    private winNumber: Label = null;

    @property(Label)
    private totalBetNumber: Label = null;

    onLoad() {
        const runScoreIns = this.winNumber.node.getComponent(RunScore);
        runScoreIns.isDecimal = true;
        runScoreIns.isDecimalFixed = true;
        runScoreIns.setPlaces = 2;
        runScoreIns.init();

        AddSignal(SignalType.RunWinScore, this.onRunWinScore.bind(this));
        AddSignal(SignalType.UpdateCredit, this.onUpdateCredit.bind(this));
        AddSignal(SignalType.ResetWinScore, this.onResetWinScore.bind(this));
    }

    private _removeSymbolRule: RemoveSymbolRule = null;
    public set SetRemoveSymbolRule(data: RemoveSymbolRule) {
        this._removeSymbolRule = data;
        // this._multiplePos = data.multipleInfo.pos;
        // this._multipleText = data.multipleInfo.text;
    }

    private _scoreToShow: number = 0;
    public set SetScoreToShow(score: number) {
        this._scoreToShow = score;
    }

    private onRunWinScore(event: ISignal) {
        AudioEngineControl.getInstance().playAudio(SoundList.RunWinScore, 1);
        let runScoreIns = this.winNumber.node.getComponent(RunScore);
        let startNum = Number(this.winNumber.string);
        let endNum = this._scoreToShow;
        runScoreIns.runScoreTime(1, endNum, startNum, () => {
            console.log("贏分 跑分結束");
            AudioEngineControl.getInstance().stopAudio();
            this.scheduleOnce(this.playAudioRunWinScoreEnd, 0);
            this.winNumber.string = Number(endNum).toFixed(2).toString();
            event.CallBack();
        });
    }

    private playAudioRunWinScoreEnd() {
        AudioEngineControl.getInstance().playAudio(SoundList.RunWinScoreEnd, 1)
    }

    // 由動畫排程觸發
    private onUpdateCredit(event: ISignal) {
        console.log("! 更新總分(餘額)");
        let originCredit = Number(this.creditNumber.string);
        let finalCredit = originCredit + this._scoreToShow;
        this.creditNumber.string = finalCredit.toFixed(2).toString();
        event.CallBack();
    }

    // 由Spin按鈕觸發
    public updateCredit(totalBet: number) {
        let originCredit = Number(this.creditNumber.string);
        let finalCredit = originCredit - totalBet;
        this.creditNumber.string = finalCredit.toFixed(2).toString();
    }

    private onResetWinScore(event: ISignal) {
        this.winNumber.string = "0.00";
        event.CallBack();
    }

    public updateTotalBet(bet: number) {
        console.log("! 目前的總投注:", bet);
        this.totalBetNumber.string = bet.toString();
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


