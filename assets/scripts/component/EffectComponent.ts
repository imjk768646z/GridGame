import { _decorator, Component, dragonBones, Label, Node, Prefab, tween, UITransform, Vec3 } from 'cc';
import { NodePoolManager } from '../singleton/NodePoolManager';
import { AddSignal, SignalManager } from '../singleton/SignalManager';
import { SignalType, SoundList } from '../Definition';
import { ISignal } from './Signal';
import { MultipleInfo, RemoveSymbolRule } from '../mvc/model/SlotProxy';
import { MultipleSymbolInfo } from '../mvc/model/MultipleProxy';
import { AudioEngineControl } from '../singleton/AudioEngineControl';
const { ccclass, property } = _decorator;

const FireBall_offsetY = 124; //火球特效與Symbol位置的Y軸偏移量
const EliminateBanner_offsetX = 45;

@ccclass('EffectComponent')
export class EffectComponent extends Component {

    @property(Prefab)
    private fireBall: Prefab = null;

    private _score: Node = null;

    private _mMultiple: Node = null;

    private fireBallStore: Node[] = [];

    private _symbolWorldPos: Vec3[][] = [];

    /**
     * 第一維索引值0代表第一個滾輪，由左至右。
     * 第二維索引值0代表第一顆symbol，由上往下。
     */
    private _symbolLocalPos: Vec3[][] = [];

    private _eliminateBannerWorldPos: Vec3 = null;

    private _eliminateBannerLocalPos: Vec3 = null;

    private _checkPosOrder: number[] = [3, 4, 2, 5, 1]; //檢查位置的順序(目前專案將順序寫死，如果會出現不同symbol數量需要再調整成共用模式)

    onLoad() {
        this._score = this.node.getChildByName("Score");
        this._mMultiple = this.node.getChildByName("MovingMultiple");
        this._score.active = false;
        this._mMultiple.active = false;

        AddSignal(SignalType.ShowFireBall, this.onShowFireBall.bind(this));
        AddSignal(SignalType.ShowMultipleOnReel, this.onShowMultipleOnReel.bind(this));
        AddSignal(SignalType.CoverMultiple, this.onCoverMultiple.bind(this));
        AddSignal(SignalType.ChangeMultipleScale, this.onChangeMultipleScale.bind(this));
        AddSignal(SignalType.ShowMultipleFly, this.onShowMultipleFly.bind(this));
    }

    public set SetSymbolsPosition(position: Vec3[][]) {
        this._symbolWorldPos = position;
        // console.log("[EffectComponent] 所有圖標的世界座標", this._symbolWorldPos);
        // 將所有圖標位置轉換為Effect節點中的本地座標
        this._symbolWorldPos.forEach(symbolPos => {
            let localAry: Vec3[] = [];
            symbolPos.forEach(worldPos => {
                const targetPos = new Vec3();
                this.node.getComponent(UITransform).convertToNodeSpaceAR(worldPos, targetPos);
                localAry.push(targetPos);
            })
            this._symbolLocalPos.push(localAry);
        })

        // console.log("[EffectComponent] 所有圖標的本地座標", this._symbolLocalPos);
    }

    public set SetEliminateBannerPosition(position: Vec3) {
        this._eliminateBannerWorldPos = position;
        const targetPos = new Vec3();
        // 將消除贏分的標籤位置轉換為Effect節點中的本地座標
        this.node.getComponent(UITransform).convertToNodeSpaceAR(this._eliminateBannerWorldPos, targetPos);
        this._eliminateBannerLocalPos = targetPos;
    }

    private _multiplePos: number[][] = [];
    private _multipleText: string[][] = [];
    /* public set SetMultipleInfo(data: MultipleInfo) {
        this._multiplePos = data.pos;
    } */

    private _removeSymbolRule: RemoveSymbolRule = null;
    public set SetRemoveSymbolRule(data: RemoveSymbolRule) {
        this._removeSymbolRule = data;
        this._multiplePos = data.multipleInfo.pos;
        this._multipleText = data.multipleInfo.text;
    }

    private _betMultiple: number;
    public set SetBetMultiple(betMultiple: number) {
        this._betMultiple = betMultiple;
    }

    private _multipleSymbolPos: MultipleSymbolInfo[] = [];
    public set SetMultipleSymbolPos(data: MultipleSymbolInfo[]) {
        this._multipleSymbolPos = data;
    }

    /* private _multipleSymbolPos: MultipleSymbolInfo;
    public set SetMultipleSymbolPos(data: MultipleSymbolInfo) {
        this._multipleSymbolPos = data;
    } */

    // todo:要依照滾輪的順序 延遲播放火球特效
    public playFireBall(pos: number[][]) {
        AudioEngineControl.getInstance().playAudio(SoundList.FireBall, 1);
        pos.forEach((ps, index) => {
            ps.forEach(symbolPos => {
                let showPos = this._symbolLocalPos[index][symbolPos - 1];
                let nodePool = NodePoolManager.getNodePoolMgr();
                let fireBall = nodePool.createNode("FireBall", this.node, this.fireBall);
                this.fireBallStore.push(fireBall);
                const targetPos = showPos.clone();
                targetPos.y = targetPos.y + FireBall_offsetY;
                fireBall.setPosition(targetPos);
                fireBall.getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, this.onFireBallComplete, this);
                fireBall.getComponent(dragonBones.ArmatureDisplay).playAnimation("play", 1);
            })
        })
    }

    private onFireBallComplete() {
        if (this.fireBallStore.length == 0) return;

        this.fireBallStore.forEach(node => {
            let nodePool = NodePoolManager.getNodePoolMgr();
            nodePool.returnNode("FireBall", node);
        })
        this.fireBallStore.splice(0, this.fireBallStore.length); //清空陣列
    }

    private onShowFireBall(event: ISignal) {
        // 倍數位置有內容時，代表要顯示火球特效
        const isShowFireBall = this._multiplePos.some(pos => pos.length > 0);
        if (isShowFireBall) {
            AudioEngineControl.getInstance().playAudio(SoundList.FireBall, 1);
            this._multiplePos.forEach((ps, index) => {
                ps.forEach(symbolPos => {
                    let showPos = this._symbolLocalPos[index][symbolPos - 1];
                    let nodePool = NodePoolManager.getNodePoolMgr();
                    let fireBall = nodePool.createNode("FireBall", this.node, this.fireBall);
                    this.fireBallStore.push(fireBall);
                    const targetPos = showPos.clone();
                    targetPos.y = targetPos.y + FireBall_offsetY;
                    fireBall.setPosition(targetPos);
                    fireBall.getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, this.onShowFireBallComplete, this);
                    fireBall.getComponent(dragonBones.ArmatureDisplay).playAnimation("play", 1);

                })
            })
        } else {
            // console.warn("不需要顯示動畫");
            event.CallBack();
        }
    }

    private onShowFireBallComplete() {
        // if (this._multiplePos.length > 0) this._multiplePos.splice(0, this._multiplePos.length);
        SignalManager.CallBack(SignalType[SignalType.ShowFireBall]);
    }

    private onShowMultipleOnReel(event: ISignal) {
        // 依照_checkPosOrder順序尋找該位置有沒有存在removePos中，並且在第幾個位置。
        let finalPos: number;
        for (let i = 0; i < this._checkPosOrder.length; i++) {
            let isFound: boolean;
            // 一律顯示在第三個滾輪 因此removePos索引值為2即是第三個滾輪
            isFound = this._removeSymbolRule.removePos[2].some(pos => pos == this._checkPosOrder[i]);
            if (isFound) {
                finalPos = this._checkPosOrder[i];
                break;
            }
        }

        if (finalPos == undefined) {
            console.error("消除位置不正確，第三個滾輪必須有消除的圖標");
            event.CallBack();
            return;
        }

        // [finalPos -1]是為了符合_symbolLocalPos的順序，索引值0紀錄的是第一個symbol的本地位置，換句話說第三個symbol的索引值則為2。
        this._score.setPosition(this._symbolLocalPos[2][finalPos - 1]);
        // todo: 增加字型
        // 小數點後補滿兩位數
        this._score.getComponent(Label).string = Number(this._removeSymbolRule.score * this._betMultiple).toFixed(2).toString();
        this._score.active = true;
        tween(this._score)
            .by(1, { position: new Vec3(0, 50, 0) })
            .call(() => {
                this._score.active = false;
                event.CallBack();
            })
            .start();
    }

    private onCoverMultiple(event: ISignal) {
        console.log("! 將倍數擋在圖標的正上方", this._multipleSymbolPos);

        this._multipleSymbolPos.forEach(symbolPos => {
            const Position = this._symbolLocalPos[symbolPos.reelBarOrdinal - 1][symbolPos.symbolOrdinal - 1].clone();
            console.log("將倍數顯示在:", Position);
            this._mMultiple.getComponent(Label).string = symbolPos.multiplText;
            this._mMultiple.setPosition(Position);
            this._mMultiple.active = true;
            event.CallBack();
        })
        /* setTimeout(() => {
            event.CallBack();
        }, 2000); */


        /* const Position = this._symbolLocalPos[this._multipleSymbolPos.reelBarOrdinal - 1][this._multipleSymbolPos.symbolOrdinal - 1].clone();
        console.log("將倍數顯示在:", Position);
        this._mMultiple.getComponent(Label).string = this._multipleSymbolPos.multiplText;
        this._mMultiple.setPosition(Position);
        this._mMultiple.active = true;
        event.CallBack(); */


    }

    private onChangeMultipleScale(event: ISignal) {
        tween(this._mMultiple)
            .to(0.3, { scale: new Vec3(1.2, 1.2, 1.2) })
            .to(0.3, { scale: new Vec3(1, 1, 1) })
            .call(() => {
                event.CallBack();
            })
            .start();
    }

    private onShowMultipleFly(event: ISignal) {
        tween(this._mMultiple)
            .to(0.5, { position: new Vec3(this._eliminateBannerLocalPos.x + EliminateBanner_offsetX, this._eliminateBannerLocalPos.y, this._eliminateBannerLocalPos.z) })
            .call(() => {
                this._mMultiple.active = false;
                event.CallBack();
            })
            .start();
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


