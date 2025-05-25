import { _decorator, Component, dragonBones, Label, Node, Size, Sprite, Tween, tween, UITransform, Vec3 } from 'cc';
import { SymbolDragonBonesResult, SymbolParam } from './ReelBar';
const { ccclass, property } = _decorator;

@ccclass('Symbol')
export class Symbol extends Component {

    @property(Label)
    public staticSymbol: Label = null; //測試用

    @property(Sprite)
    private static: Sprite = null; //Sprite組件顯示symbol

    @property(dragonBones.ArmatureDisplay)
    private dynamic: dragonBones.ArmatureDisplay = null; //龍骨動畫顯示symbol

    @property(dragonBones.ArmatureDisplay)
    private frame: dragonBones.ArmatureDisplay = null; //龍骨動畫顯示外框

    @property(Label)
    private multiple: Label = null; //顯示倍率獎勵

    @property(dragonBones.ArmatureDisplay)
    private eliminate: dragonBones.ArmatureDisplay = null; //龍骨動畫顯示消除

    @property(Label)
    private symbolID: Label = null;

    private symbolId: number = 0; //假設symbolId為1 就是畫面中的最上面的symbol 之後由上往下遞增Id
    private moveDistance: number = 0;
    private onNextRolling: Function = null;
    private allSymbolPostion: Vec3[] = [];
    private bottomLimitPos: Vec3 = null;
    private tweenIns: Tween<Node> = null;
    private reelData: string[] = [];
    private reelResult: string[] = [];
    private resultIndex: number = -1;
    private _symbolName: string = "";

    onLoad() {
        this.reset();

    }

    start() {

    }

    public reset() {
        this.staticSymbol.node.active = true;
        this.static.node.active = true;
        this.dynamic.node.active = false;
        this.frame.node.active = false;
        this.multiple.node.active = false;
        this.eliminate.node.active = false;
    }

    public init(param: SymbolParam) {
        this.reset();
        this.node.getComponent(UITransform).setContentSize(new Size(param.symbolWidth, param.symbolHeight));
        this.symbolId = param.symbolId;
        // console.log("Symbol ID:", this.symbolId);
        this.moveDistance = param.rollingDistance;
        this.onNextRolling = param.rollingCallback;
        this.allSymbolPostion = param.symbolPosition;
        // this.bottomLimitPos = param.symbolSwitchPos;
        this.bottomLimitPos = this.allSymbolPostion[this.allSymbolPostion.length - 1];
        this.reelData = param.reelData;
        this.node.getChildByName("Frame").active = false;
        this.symbolID.string = this.getSymbolId.toString();
    }

    public get getSymbolId() {
        return this.symbolId;
    }

    public set setSymbolId(id: number) {
        this.symbolId = id;
        this.symbolID.string = id.toString();
    }

    public get GetSymbolName(): string {
        return this._symbolName;
    }

    public set SetSymbolName(name: string) {
        this._symbolName = name;
    }

    public get GetMultipleText(): string {
        return this.multiple.string;
    }

    public updateMultiple(text: string) {
        this.multiple.node.active = true;
        this.multiple.string = text;
    }

    public showFrame(callback: Function, owner: object) {
        this.frame.node.active = true;
        this.frame.once(dragonBones.EventObject.COMPLETE, callback, owner);
        this.frame.playAnimation("play", 1);
    }

    public hideFrame() {
        this.frame.node.active = false;
    }

    public showDynamic(callback: Function, owner: object, dragonBonesParam: SymbolDragonBonesResult) {
        this.dynamic.node.active = true;
        this.dynamic.dragonAsset = dragonBonesParam.dragonAsset;
        this.dynamic.dragonAtlasAsset = dragonBonesParam.dragonAtlasAsset;
        this.dynamic.armatureName = dragonBonesParam.armatureName;
        this.dynamic.node.scale = dragonBonesParam.scale;
        this.dynamic.once(dragonBones.EventObject.COMPLETE, callback, owner);
        this.dynamic.playAnimation(dragonBonesParam.animationName, 1);
    }

    public hideDynamic() {
        this.dynamic.node.active = false;
    }

    public showEliminate(callback: Function, owner: object) {
        this.eliminate.node.active = true;
        this.eliminate.once(dragonBones.EventObject.COMPLETE, callback, owner);
        this.eliminate.playAnimation("play", 1);
    }

    public hideEliminate() {
        this.eliminate.node.active = false;
    }

    rolling(speed: number, dataIndex: number, resultIndex?: number) {
        // console.log("最終資料 index:", resultIndex)
        this.resultIndex = resultIndex;
        this.tweenIns = tween(this.node)
            .by(speed, { position: new Vec3(0, -(this.moveDistance), 0) })
            .call(() => {
                if (this.resultIndex != undefined && this.resultIndex >= 0) {
                    // console.log("最終資料 index:", this.resultIndex)
                    this.updatePosition(this.resultIndex, true);

                } else {
                    // console.log("回到基本盤面 index:", this.resultIndex)
                    this.updatePosition(dataIndex);
                }
            })
            .start();
    }

    bounce() {
        tween(this.node)
            .by(0.1, { position: new Vec3(0, -15, 0) })
            .by(0.2, { position: new Vec3(0, 20, 0) })
            .by(0.1, { position: new Vec3(0, -5, 0) })
            .start();
    }

    private updatePosition(newIndex: number, isResult = false) {
        this.symbolId++; //移動至新的位置後更新ID(永遠往下移動，因此使用累加)

        if (this.node.position.y <= this.bottomLimitPos.y) {
            this.node.setPosition(this.allSymbolPostion[0]); //設置到頂部位置
            this.symbolId = 0; //移動至頂部位置後ID歸零
            this.node.getChildByName("StaticSymbol").getComponent(Label).string = isResult ? this.reelResult[newIndex] : this.reelData[newIndex];
            this.onNextRolling();
        }
    }

    public setResultData(data: string[]) {
        this.reelResult = data;
    }

    update(deltaTime: number) {

    }
}


