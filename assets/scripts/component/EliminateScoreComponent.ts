import { _decorator, Color, Component, Label, Node, tween, UIOpacity, Vec3 } from 'cc';
import { AddSignal } from '../singleton/SignalManager';
import { SignalType, SoundList } from '../Definition';
import { ISignal } from './Signal';
import { MultipleSymbolInfo } from '../mvc/model/MultipleProxy';
import { RemoveSymbolRule } from '../mvc/model/SlotProxy';
import { RunScore } from './RunScore';
import { AudioEngineControl } from '../singleton/AudioEngineControl';
const { ccclass, property } = _decorator;

const MovementDistance = 50;

interface EliminateNodesPoision {
    scoreNode: Vec3;
    multipleValueNode: Vec3;
}

@ccclass('EliminateScoreComponent')
export class EliminateScoreComponent extends Component {

    @property(Node)
    private banner: Node = null;

    @property(Node)
    private score: Node = null;

    @property(Node)
    private mathSymbol: Node = null;

    @property(Node)
    private multipleValue: Node = null;

    private originalPosition: EliminateNodesPoision = null;

    onLoad() {
        this.originalPosition = <EliminateNodesPoision>{
            scoreNode: this.score.getPosition(),
            multipleValueNode: this.multipleValue.getPosition()
        }
        this.node.active = false;
        this.mathSymbol.active = false;
        this.multipleValue.active = false;

        const runScoreIns = this.score.getComponent(RunScore);
        runScoreIns.isDecimal = true;
        runScoreIns.isDecimalFixed = true;
        runScoreIns.setPlaces = 2;
        runScoreIns.init();

        AddSignal(SignalType.ShowEliminateScore, this.onShowEliminateScore.bind(this));
        AddSignal(SignalType.CloseEliminateScore, this.onCloseEliminateScore.bind(this));
        AddSignal(SignalType.AdditionEliminateScore, this.onAdditionEliminateScore.bind(this));
        AddSignal(SignalType.EliminateScoreMoveLeft, this.onEliminateScoreMoveLeft.bind(this));
        AddSignal(SignalType.RunEliminateScore, this.onRunEliminateScore.bind(this));
        AddSignal(SignalType.RunEliminateScoreFGState, this.onRunEliminateScoreFGState.bind(this));
        AddSignal(SignalType.ShowMathematicalSymbol, this.onShowMathematicalSymbol.bind(this));
        AddSignal(SignalType.ShowMultipleValue, this.onShowMultipleValue.bind(this));
        AddSignal(SignalType.CloseMathematicalSymbol, this.onCloseMathematicalSymbol.bind(this));
        AddSignal(SignalType.EliminateScoreMoveBack, this.onEliminateScoreMoveBack.bind(this));
        AddSignal(SignalType.MultipleValueMoveLeftAndDisappear, this.onMultipleValueMoveLeftAndDisappear.bind(this));
        AddSignal(SignalType.MultiplicationEliminateScore, this.onMultiplicationEliminateScore.bind(this));

    }

    public get GetEliminateBannerWorldPosition(): Vec3 {
        return this.banner.worldPosition;
    }

    private _multipleSymbolPos: MultipleSymbolInfo[] = [];
    public set SetMultipleSymbolPos(data: MultipleSymbolInfo[]) {
        this._multipleSymbolPos = data;
    }

    private _scoreToShow: number = 0;
    public set SetScoreToShow(score: number) {
        this._scoreToShow = score;
    }

    private _removeSymbolRule: RemoveSymbolRule = null;
    public set SetRemoveSymbolRule(data: RemoveSymbolRule) {
        this._removeSymbolRule = data;
        // this._multiplePos = data.multipleInfo.pos;
        // this._multipleText = data.multipleInfo.text;
    }

    public reset() {
        this.score.getComponent(Label).string = "";
        this.multipleValue.getComponent(Label).string = "";
    }

    private onShowEliminateScore(event: ISignal) {
        this.node.active = true;
        event.CallBack();
    }

    private onCloseEliminateScore(event: ISignal) {
        this.node.active = false;
        event.CallBack();
    }

    private onAdditionEliminateScore(event: ISignal) {
        /* let scoreLabel = this.score.getComponent(Label).string;
        if (scoreLabel != "") {
            let originScore = Number(scoreLabel);
            let currentScore = this._removeSymbolRule.score;
            let finalSocre = originScore + currentScore;
            this.score.getComponent(Label).string = Number(finalSocre).toFixed(2).toString();
        } else {
            this.score.getComponent(Label).string = Number(this._removeSymbolRule.score).toFixed(2).toString();
        } */

        event.CallBack();
    }

    private onEliminateScoreMoveLeft(event: ISignal) {
        tween(this.score)
            .by(0.5, { position: new Vec3(-(MovementDistance), 0, 0) })
            .call(() => {
                event.CallBack();
            })
            .start();
    }

    private onRunEliminateScore(event: ISignal) {
        let scoreLabel = this.score.getComponent(Label).string;
        let runScoreIns = this.score.getComponent(RunScore);
        let startNum: number = 0.00;
        let endNum: number;
        if (scoreLabel != "") {
            startNum = Number(scoreLabel);         //從Label原本停留的數字開始
            endNum = startNum + this._scoreToShow; //加上本次消除的分數
            runScoreIns.runScoreTime(1, endNum, startNum, () => {
                console.log("消除贏分 跑分結束");
                this.score.getComponent(Label).string = Number(endNum).toFixed(2).toString();
                event.CallBack();
            });
        } else {
            endNum = Number(this._scoreToShow.toFixed(2));
            runScoreIns.runScoreTime(1, endNum, startNum, () => {
                console.log("消除贏分 跑分結束");
                this.score.getComponent(Label).string = Number(endNum).toFixed(2).toString();
                event.CallBack();
            });
        }
    }

    private onRunEliminateScoreFGState(event: ISignal) {
        let runScoreIns = this.score.getComponent(RunScore);
        let startNum: number = 0.00;
        let endNum = Number(this._scoreToShow.toFixed(2));
        runScoreIns.runScoreTime(1, endNum, startNum, () => {
            console.log("消除贏分 跑分結束[FG]");
            this.score.getComponent(Label).string = Number(endNum).toFixed(2).toString();
            event.CallBack();
        });
    }

    private onShowMathematicalSymbol(event: ISignal) {
        this.mathSymbol.active = true;
        event.CallBack();
        /* tween(this.mathSymbol)
            .to(0.4, { scale: new Vec3(1, 1, 1) })
            .call(() => {
                // this.mathSymbol.active = false;
                // this.mathSymbol.setScale(new Vec3(0.1, 0.1, 0.1));
                event.CallBack();
            })
            .start(); */
    }

    private _multipleToCalculate: number = 0;
    public set SetMultipleToCalculate(multiple: number) {
        this._multipleToCalculate = multiple;
    }

    private onShowMultipleValue(event: ISignal) {
        this.multipleValue.active = true;
        this.multipleValue.getComponent(Label).string = this._multipleToCalculate.toString();
        tween(this.multipleValue)
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .call(() => {
                // this.multipleValue.active = false;
                // this.multipleValue.setScale(new Vec3(0.1, 0.1, 0.1));
                event.CallBack();
            })
            .start();
    }

    private onCloseMathematicalSymbol(event: ISignal) {
        this.mathSymbol.active = false;
        event.CallBack();
    }

    private onEliminateScoreMoveBack(event: ISignal) {
        tween(this.score)
            .to(0.5, { position: this.originalPosition.scoreNode })
            .call(() => {
                event.CallBack();
            })
            .start();
    }

    private onMultipleValueMoveLeftAndDisappear(event: ISignal) {
        let tweenDuration: number = 0.5;
        let t1 = tween(this.multipleValue)
            .by(tweenDuration, { position: new Vec3(-(MovementDistance), 0, 0) })
            .call(() => {
                this.multipleValue.setPosition(this.originalPosition.multipleValueNode);
                // event.CallBack();
            })
            .start();

        const opacity = this.multipleValue.getComponent(UIOpacity);
        let t2 = tween(opacity)
            .to(tweenDuration, { opacity: 0 })
            .call(() => {
                this.multipleValue.active = false;
                this.multipleValue.getComponent(UIOpacity).opacity = 255;
                event.CallBack();
            })
            .start();
    }

    private onMultiplicationEliminateScore(event: ISignal) {
        AudioEngineControl.getInstance().playAudio(SoundList.MultiplicationEnd, 1);
        let originScore = Number(this.score.getComponent(Label).string);
        let currentMutiple = Number(this.multipleValue.getComponent(Label).string);
        let finalSocre = originScore * currentMutiple;
        this.score.getComponent(Label).string = Number(finalSocre).toFixed(2).toString();

        tween(this.score)
            .to(0.3, { scale: new Vec3(1.5, 1.5, 1.5) })
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .call(() => {
                event.CallBack();
            })
            .start();
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


