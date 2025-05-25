import { _decorator, Component, dragonBones, Label, Node, Prefab, Sprite, SpriteFrame, tween, UITransform, Vec2, Vec3 } from 'cc';
import { Symbol } from './Symbol';
import { NodePoolManager } from '../singleton/NodePoolManager';
import { ISignal } from './Signal';
import { SignalType, SoundList } from '../Definition';
import { AddSignal } from '../singleton/SignalManager';
import { AssetsProperty } from '../mvc/controller/AssetsSavedCommand';
import { MultipleInfo, RemoveSymbolRule } from '../mvc/model/SlotProxy';
import { MultipleSymbolInfo } from '../mvc/model/MultipleProxy';
import { AudioEngineControl } from '../singleton/AudioEngineControl';

const { ccclass, property } = _decorator;

export type SymbolParam = {
    symbolHeight: number,
    symbolWidth: number,
    symbolId: number,
    rollingDistance: number,
    rollingCallback: Function,
    symbolPosition: Vec3[],
    reelData: string[],
}

@ccclass('ReelBar')
export class ReelBar extends Component {

    @property(Prefab)
    private symbol: Prefab = null;

    private topOuterSymbolPos: Vec3;
    private symbolGroup: Node = null;
    private symbolNode: Node[] = []; //紀錄每一個Symbol的資訊 不過在消除類沒什麼用處 有symbolGroup就足夠
    private symbolPosition: Vec3[] = []; //每個symbol所在的位置
    private symbolRemove: number[] = [];
    private symbolAdd: number[] = []; //等待補足的symbol
    private symbolSpaceY: number = 0;  //可由外部或在此指定
    private symbolHeight: number = 100; //可由外部或在此指定
    private symbolWidth: number = 100;  //可由外部或在此指定
    private symbolCountFOV: number = 5; //可視範圍的圖標數量
    private symbolMove: Node[] = [];
    // private symbolSwitchPos: Vec3 = null;
    private isRolling: boolean = false;
    private rollingDuration: number = 1;
    private rollingDistance: number = 0;
    private rollingRestOfSymbols: number = 0; //至少再滾動的次數(等同幾個symbol)
    private rollingSymbolMinimumCount: number = 6; //這個變數由最外層ReelControl設定比較好 因為每個滾輪需要轉動的Symbol數量不一樣
    private rolledSymbolCount: number = 0; //已滾動的symbol數量
    private isQuickStop: boolean = false;
    private rollingSpeed: number = 0.6; //滾輪轉動速度(意旨SymbolGroup)
    private fallingSpeed: number = 0.2; //圖標掉落速度(意旨Symbol)
    private rollingTempo: number[] = [0.4, 0.8];
    private fakeReelData: string[] = ["A", "B", "C", "D", "E", "F", "G", "H",];
    private _baseReelData: string[] = [];
    private resultReelData: string[] = [];
    private nextReelDataIndex: number = 0; //下一個準備從盤面(fakeReelData)尋找的索引值
    private isResult: boolean = false;
    private resultIndex: number = 0;
    private finishCallback: Function = null; //滾輪停止時呼叫
    private _assets: AssetsProperty = null;
    private _reelBarId: number;

    private _removeSymbolData: number[] = null; //依照該陣列刪除symbol節點

    private _updateReelData: string[] = [];
    private _removePos: number[] = [];
    private _multiplePos: number[];
    private _multipleText: string[];
    public SetRemoveSymbolRule(updateReelData: string[], removePos: number[], multiplePos: number[], multipleText: string[]) {
        this._updateReelData = updateReelData;
        this._removePos = removePos;
        this._multiplePos = multiplePos;
        this._multipleText = multipleText;
    }

    /* private _removeSymbolRule: RemoveSymbolRule = null
    public set SetRemoveSymbolRule(data: RemoveSymbolRule) {
        this._removeSymbolRule = data;
        this._updateReelData = data.updateReelData
    } */

    public set SetBaseReelData(reelData: string[]) {
        this._baseReelData = reelData;
    }

    public set SetAssets(assets: AssetsProperty) {
        this._assets = assets;
    }

    public get GetSymbolWorldPosition(): Vec3[] {
        let worldPositions: Vec3[] = []
        this.symbolNode.forEach((node, index) => {
            worldPositions.push(node.worldPosition);
        });
        return worldPositions;
    }

    public searchMultipleSymbol(): MultipleSymbolInfo[] {
        const MultipleGroup: MultipleSymbolInfo[] = [];
        this.symbolGroup.children.forEach(node => {
            let symbolIns = node.getComponent(Symbol);
            // console.log("圖標:", symbolIns.GetSymbolName, "位置:", symbolIns.getSymbolId, "滾輪:", this._reelBarId);
            if (symbolIns.GetSymbolName.substring(0, 1) == "S") {
                const MultipleInfo = <MultipleSymbolInfo>{
                    reelBarOrdinal: this._reelBarId,
                    symbolOrdinal: symbolIns.getSymbolId,
                    multiplText: symbolIns.GetMultipleText,
                }
                MultipleGroup.push(MultipleInfo);
            }
        })
        return MultipleGroup;
    }

    onLoad() {
        this.symbolGroup = this.node.getChildByName("SymbolGroup");
        this._reelBarId = Number(this.node.name.substring(7, this.node.name.length));

        // this.initailReelBar();
        /* this.symbolNode = this.node.children;
        // console.log("symbol index:", this.symbolNode.getSiblingIndex());

        // 記錄每一個圖標的位置
        const TopY = this.node.getComponent(UITransform).contentSize.height / 2;
        const SymbolHalfHeight = this.symbolHeight / 2;

        for (let i = 0; i < this.symbolCountFOV + 2; i++) { //+2是可視範圍以外上下各一顆symbol的位置
            if (i == 0) {
                this.symbolPosition.push(new Vec3(0, TopY + this.symbolSpaceY + SymbolHalfHeight, 0));
            } else {
                this.symbolPosition.push(new Vec3(0, this.symbolPosition[0].y - (this.symbolSpaceY * i) - (this.symbolHeight * i), 0));
            }
        }
        // 圖標切換的關鍵位置
        // this.symbolSwitchPos = new Vec3(0, this.symbolPosition[this.symbolPosition.length - 1].y - this.symbolSpaceY - this.symbolHeight, 0);

        console.log("symbol position:", this.symbolPosition);
        console.log("bottom position:", this.symbolPosition[this.symbolPosition.length - 1].y - this.symbolSpaceY - this.symbolHeight);

        // 設定圖標位置
        this.symbolNode.forEach((node, index) => {
            // console.log("sibling index:", node.getSiblingIndex());
            node.setPosition(this.symbolPosition[index])
            let symbolIns = node.getComponent(Symbol);
            const SymbolInit = <SymbolParam>{
                symbolId: index,
                rollingDistance: this.symbolHeight + this.symbolSpaceY,
                rollingCallback: this.symbolRolling.bind(this),
                symbolPosition: this.symbolPosition,
                reelData: this.fakeReelData,
            };
            symbolIns.init(SymbolInit);
            node.getChildByName("StaticSymbol").getComponent(Label).string = this.fakeReelData[this.symbolCountFOV - index];
            this.nextReelDataIndex = index;
            // symbolIns.setSymbolId = index;
            // symbolIns.setNextRolling = this.symbolRolling.bind(this);
        }) */
    }

    start() {
        AddSignal(SignalType.Write, this.onWriteTest.bind(this));
        /* setTimeout(() => {
            this.isRolling = false;
        }, 3000);

        setTimeout(() => {
            this.symbolNode.forEach(node => {
                let symbolIns = node.getComponent(Symbol);
                if (symbolIns.getSymbolId == 0) {
                    console.log("real node index:", node.getSiblingIndex());
                }
            })
        }, 4500); */
    }

    public initailReelBar() {
        this.topOuterSymbolPos = new Vec3(0, this.node.getComponent(UITransform).contentSize.height, 0);
        this.rollingDistance = this.node.getComponent(UITransform).contentSize.height;

        const TopY = this.node.getComponent(UITransform).contentSize.height / 2;
        const SymbolHalfHeight = this.symbolHeight / 2;
        const AllPositionCount = this.symbolCountFOV + 1; //+1是可視範圍外最上方的symbol位置

        // 從可視範圍外的最上方開始，由上而下產生symbol
        for (let i = 0; i < AllPositionCount; i++) {
            // 可視範圍外的最下方不需要產生symbol
            /* if (i != AllPositionCount - 1) {
                let nodePool = NodePoolManager.getNodePoolMgr();
                let symbol = nodePool.createNode("Symbol", this.node, this.symbol);
                this.symbolNode.push(symbol);
            } */
            // 記錄每一個圖標的位置(框線外最上方位置 + 可視範圍N個symbol位置)
            if (i == 0) {
                this.symbolPosition.push(new Vec3(0, TopY + SymbolHalfHeight, 0));
            } else {
                // 由上而下產生symbol
                let nodePool = NodePoolManager.getNodePoolMgr();
                let symbol = nodePool.createNode("Symbol", this.symbolGroup, this.symbol);
                this.symbolNode.push(symbol);
                this.symbolPosition.push(new Vec3(0, this.symbolPosition[0].y - (this.symbolSpaceY * i) - (this.symbolHeight * i), 0));
            }
        }

        this.arrangeSymbol();
    }

    // 由上而下排列圖標
    private arrangeSymbol() {
        this.symbolGroup.children.forEach((node, index) => {
            node.setPosition(this.symbolPosition[index + 1]) //symbol不包含0這個位置
            let symbolIns = node.getComponent(Symbol);
            const SymbolInit = <SymbolParam>{
                symbolHeight: this.symbolHeight,
                symbolWidth: this.symbolWidth,
                symbolId: index + 1, //index從零開始 symbolId從1開始
                rollingDistance: this.symbolHeight + this.symbolSpaceY,
                rollingCallback: this.symbolRolling.bind(this),
                symbolPosition: this.symbolPosition,
                reelData: this.fakeReelData,
            };
            symbolIns.init(SymbolInit);
            // node.getChildByName("StaticSymbol").getComponent(Label).string = this._baseReelData[this.symbolCountFOV - index - 1]; //從盤面陣列的後面開始獲取
            node.getChildByName("StaticSymbol").getComponent(Label).string = this._baseReelData[index];                           //從盤面陣列的前面開始獲取

            const SpriteParam = this.getSymbolSprite(this._baseReelData[index]);
            symbolIns.SetSymbolName = this._baseReelData[index];
            node.getChildByName("Static").getComponent(Sprite).spriteFrame = SpriteParam.spriteFrame;
            node.getChildByName("Static").scale = SpriteParam.scale;
        })
    }

    private getSymbolSprite(symbolName: string): SymbolSpriteResult {
        const spriteInfo = <SpriteInfo>SymbolSpriteSetting[symbolName];
        const SP = this._assets.symbols.get(spriteInfo.spriteName);
        return <SymbolSpriteResult>{
            spriteFrame: SP,
            scale: new Vec3(spriteInfo.scale, spriteInfo.scale, 0)
        };
    }

    // 需要呈現symbol特效才需要使用
    private getSymbolDragonBone(symbolName: string): SymbolDragonBonesResult {
        const dragonInfo = <DragonBoneInfo>SymbolDragonBonesSetting[symbolName];
        const DragonBonesAsset = this._assets.dragonBones.get(dragonInfo.dragonAsset);
        const DragonBonesAtlasAsset = this._assets.dragonBonesAtlas.get(dragonInfo.dragonAtlasAsset);
        return <SymbolDragonBonesResult>{
            dragonAsset: DragonBonesAsset,
            dragonAtlasAsset: DragonBonesAtlasAsset,
            armatureName: dragonInfo.armatureName,
            animationName: dragonInfo.animationName,
            scale: new Vec3(dragonInfo.scale, dragonInfo.scale, 0)
        };
    }

    public spinOut(onComplete?: Function) {
        // this.rolling();
        tween(this.symbolGroup)
            .by(this.rollingSpeed, { position: new Vec3(0, -(this.rollingDistance), 0) })
            .call(() => {
                this.updateSymbolGroupPos();
                onComplete?.();
            })
            .start();

        /* setTimeout(() => {
            onComplete();
        }, 2000); */
    }

    public spinIn(lastOrder: number, data?: string[]) {
        // 依照symbolId的順序塞值，data陣列的索引值+1是為了符合symbolId規則，因為symbolId最小從1開始
        data.forEach((name, idx) => {
            this.symbolGroup.children.forEach((node, index) => {
                let symbolIns = node.getComponent(Symbol);
                if (idx + 1 == symbolIns.getSymbolId) {
                    const SpriteParam = this.getSymbolSprite(name);
                    symbolIns.SetSymbolName = name;
                    node.getChildByName("StaticSymbol").getComponent(Label).string = name;
                    node.getChildByName("Static").getComponent(Sprite).spriteFrame = SpriteParam.spriteFrame;
                    node.getChildByName("Static").scale = SpriteParam.scale;
                }
            })
        })

        this.rollingIn(lastOrder);
    }

    /* private _multipleText: string[] = [];
    public set SetMultipleText(data: string[]) {
        this._multipleText = data;
        console.log("!設定倍數資訊", data);
    } */

    public updateMultipleText(pos: number[], text: string[]) {
        pos.forEach((ordinal, index) => {
            this.symbolGroup.children.forEach((node) => {
                let symbolIns = node.getComponent(Symbol);
                // ordinal為序數，尋找symbolId與序數相同的symbol
                if (symbolIns.getSymbolId == ordinal) {
                    symbolIns.updateMultiple(text[index]);
                }
            })
        })
    }

    private testData = null;
    public writeData(data: string) {
        this.testData = data;
    }

    private onWriteTest(event: ISignal) {
        console.log("onWriteTest 是否拿到資料:", this.testData);
        event.CallBack();
    }

    private getResult = null;
    public playSpin(newReel: number[][], callback?: Function) {
        this.getResult = callback;
        this.rolling();
        // console.log("實際轉動滾輪 準備出現的滾輪資訊:", newReel);
        // this.isRolling = true;
        // this.symbolRolling();
        // this.setResultDate(["X", "Y", "Z"]);
    }

    public set RollingCallBack(func: Function) {
        this.finishCallback = func;
    }

    private rolling() {
        tween(this.symbolGroup)
            .by(1, { position: new Vec3(0, -(this.rollingDistance), 0) })
            .call(() => {
                this.updateSymbolGroupPos();
                if (this.getResult) {
                    this.getResult();
                    this.getResult = null;
                }
            })
            .start();
    }

    private rollingIn(lastID: number) {
        if (this.symbolGroup.position.y === this.topOuterSymbolPos.y) {
            tween(this.symbolGroup)
                .to(this.rollingSpeed, { position: new Vec3(0, 0, 0) })
                .call(() => {
                    if (this._reelBarId == 1) AudioEngineControl.getInstance().playAudio(SoundList.SPININ, 1); //第一個滾輪到達定位後才播放停止音效，其餘滾輪不用
                    if (this._reelBarId == lastID) this.finishCallback?.();
                })
                .start();
        } else {
            console.error("--滾輪位置錯誤--", this.symbolGroup.position);
        }
    }

    // 更新SymbolGroup位置
    private updateSymbolGroupPos() {
        if (this.symbolGroup.position.y === 0) return;
        this.symbolGroup.setPosition(this.topOuterSymbolPos);
    }

    public showFrame(callback: Function, owner: object) {
        /* this.symbolGroup.children.forEach((node, index) => {
            let symbolIns = node.getComponent(Symbol);
            // if (symbolIns.getSymbolId == 1 || symbolIns.getSymbolId == 3 || symbolIns.getSymbolId == 5) {
            node.getChildByName("Frame").active = true;
            // node.getChildByName("Frame").getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, this.onShowFrameComplete, this);
            node.getChildByName("Frame").getComponent(dragonBones.ArmatureDisplay).once(dragonBones.EventObject.COMPLETE, callback, owner);
            node.getChildByName("Frame").getComponent(dragonBones.ArmatureDisplay).playAnimation("play", 1);
            // }
        }) */

        this._removePos.forEach(ordinal => {
            this.symbolGroup.children.forEach((node) => {
                let symbolIns = node.getComponent(Symbol);
                if (symbolIns.getSymbolId == ordinal) {
                    symbolIns.showFrame(callback, owner);
                }
            })
        });
    }

    public hideAllFrame() {
        this.symbolGroup.children.forEach((node) => {
            let symbolIns = node.getComponent(Symbol);
            symbolIns.hideFrame();
        });
    }

    public showDynamic(callback: Function, owner: object) {
        // 藉由移除的圖標資訊找到對應的symbol，取出目前的symbol名稱
        this._removePos.forEach(ordinal => {
            this.symbolGroup.children.forEach((node) => {
                let symbolIns = node.getComponent(Symbol);
                if (symbolIns.getSymbolId == ordinal) {
                    const DragonBonesParam = this.getSymbolDragonBone(symbolIns.GetSymbolName);
                    symbolIns.showDynamic(callback, owner, DragonBonesParam);
                }
            })
        })
    }

    public showFreeSymbolDynamic(callback: Function, owner: object) {
        this.symbolGroup.children.forEach((node) => {
            let symbolIns = node.getComponent(Symbol);
            if (symbolIns.GetSymbolName == "F") {
                const DragonBonesParam = this.getSymbolDragonBone(symbolIns.GetSymbolName);
                symbolIns.showDynamic(callback, owner, DragonBonesParam);
            }
        })
    }

    public showSingleDynamic(symbolOrdinal: number, callback: Function, owner: object) {
        this.symbolGroup.children.forEach((node) => {
            let symbolIns = node.getComponent(Symbol);
            if (symbolIns.getSymbolId == symbolOrdinal) {
                const DragonBonesParam = this.getSymbolDragonBone(symbolIns.GetSymbolName);
                symbolIns.showDynamic(callback, owner, DragonBonesParam);
            }
        })
    }

    public hideAllDynamic() {
        this.symbolGroup.children.forEach((node) => {
            let symbolIns = node.getComponent(Symbol);
            symbolIns.hideDynamic();
        });
    }

    public showEliminate(callback: Function, owner: object) {
        this._removePos.forEach(ordinal => {
            this.symbolGroup.children.forEach((node) => {
                let symbolIns = node.getComponent(Symbol);
                if (symbolIns.getSymbolId == ordinal) {
                    symbolIns.showEliminate(callback, owner);
                }
            })
        })
    }

    public hideAllEliminate() {
        this.symbolGroup.children.forEach((node) => {
            let symbolIns = node.getComponent(Symbol);
            symbolIns.hideEliminate();
        });
    }

    private onShowFrameComplete() {
        console.log("顯示外框完畢");
    }

    public async removeSymbol() {
        // 移除指定的symbol
        this._removePos.forEach(symbolId => {
            this.symbolRemove.push(symbolId);
            this.symbolGroup.children.forEach((node, index) => {
                let symbolIns = node.getComponent(Symbol);
                if (symbolIns.getSymbolId == symbolId) {
                    let nodePool = NodePoolManager.getNodePoolMgr();
                    nodePool.returnNode("Symbol", node);
                }
            })
        })

        // 處理所剩symbol的掉落方式
        // console.log("所剩圖標:", this.symbolGroup.children);
        // console.log("展開陣列:", ...this.symbolRemove);
        let removedMaxSymbolId = Math.max(...this.symbolRemove);
        // console.log("最大數值的圖標:", removedMaxSymbolId);

        const tweenPromise: Promise<Node>[] = [];

        this.symbolGroup.children.forEach((node, index) => {
            let symbolIns = node.getComponent(Symbol);
            // console.log("檢查symbol id:", symbolIns.getSymbolId);
            let startId = symbolIns.getSymbolId;
            let symbolCount = 0;
            if (symbolIns.getSymbolId < removedMaxSymbolId) {
                for (let i = startId; i < removedMaxSymbolId; i++) {
                    // checkId += i;
                    startId++;
                    this.symbolRemove.forEach(symbolId => {
                        if (startId == symbolId) symbolCount++;
                    })
                }
            }
            symbolIns.setSymbolId = symbolIns.getSymbolId + symbolCount;
            /* tween(node)
                .to(1, { position: this.symbolPosition[symbolIns.getSymbolId] })
                .start(); */
            if (symbolCount != 0) { //symbolCount不為0代表ID值改變過，需要做掉落處理，如果為0代表ID值沒有改變，不須做任何移動
                const p = new Promise<Node>(resolve => {
                    tween(node)
                        .to(this.fallingSpeed, { position: this.symbolPosition[symbolIns.getSymbolId] })
                        .call(() => {
                            this.specificSymbolBounce(symbolIns.getSymbolId);
                            resolve(node);
                        })
                        .start();
                })
                tweenPromise.push(p);
            }
        })

        await Promise.all(tweenPromise)
            .then(() => {
                //清空symbolRemove
                this.symbolRemove.splice(0, this.symbolRemove.length);
            })
            .catch((err) => { console.error(err); });
    }

    public async fillSymbol() {
        // 補足缺少的symbol
        let restOfSymbol = [];  //剩下的symbol
        let pendingSymbol = []; //作用和symbolAdd一樣
        this.symbolGroup.children.forEach(node => {
            let symbolIns = node.getComponent(Symbol);
            restOfSymbol.push(symbolIns.getSymbolId);
            // console.log("掉落後所剩的symbol ID:", symbolIns.getSymbolId);
        })
        // 紀錄待補的symbol(不存在剩下的symbol陣列中就是要補足的symbol)
        for (let i = 1; i <= this.symbolCountFOV; i++) {
            const Index = restOfSymbol.indexOf(i);
            if (Index == -1) this.symbolAdd.push(i);
        }
        pendingSymbol = this.symbolAdd;
        // console.log("待補足的symbol:", this.symbolAdd, "暫存symbol", pendingSymbol);
        // console.log("待補次數", this.symbolAdd.length);

        let addMaxSymbolId = Math.max(...pendingSymbol);
        const tweenPromise: Promise<Node>[] = [];
        this.symbolAdd.forEach((symbolId, idx) => {
            // console.log("補上ID:", symbolId);
            // 按照symbolAdd順序，決定最終的symbol id，由數字最大的開始擺放，因此盤面從陣列的後面開始獲取
            let startId = 0;
            let symbolCount = 0;
            for (let i = 0; i < addMaxSymbolId - idx; i++) {
                startId++;
                pendingSymbol.forEach(symbolId => {
                    if (startId == symbolId) symbolCount++;
                })
            }

            let nodePool = NodePoolManager.getNodePoolMgr();
            let symbol = nodePool.createNode("Symbol", this.symbolGroup, this.symbol);
            let symbolIns = symbol.getComponent(Symbol);
            symbol.setPosition(this.symbolPosition[0]);
            const SymbolInit = <SymbolParam>{
                symbolId: symbolCount,
                rollingDistance: this.symbolHeight + this.symbolSpaceY,
                rollingCallback: this.symbolRolling.bind(this),
                symbolPosition: this.symbolPosition,
                reelData: this.fakeReelData,
            };
            symbolIns.init(SymbolInit);
            // const SpriteParam = this.getSymbolSprite(this._updateReelData[idx]); //從盤面陣列的前面開始獲取
            const SpriteParam = this.getSymbolSprite(this._updateReelData[this._updateReelData.length - 1 - idx]); //從盤面陣列的後面開始獲取
            symbolIns.SetSymbolName = this._updateReelData[this._updateReelData.length - 1 - idx];
            symbol.getChildByName("StaticSymbol").getComponent(Label).string = this._updateReelData[this._updateReelData.length - 1 - idx];
            symbol.getChildByName("Static").getComponent(Sprite).spriteFrame = SpriteParam.spriteFrame;
            symbol.getChildByName("Static").scale = SpriteParam.scale;
            // console.log("補上symbol id", symbolIns.getSymbolId);

            const p = new Promise<Node>(resolve => {
                tween(symbol)
                    // .to(Math.abs(symbolCount - (this.symbolCountFOV + 1)) * 0.3, { position: this.symbolPosition[symbolIns.getSymbolId] })
                    .to(this.fallingSpeed, { position: this.symbolPosition[symbolIns.getSymbolId] })
                    .call(() => {
                        this.specificSymbolBounce(symbolIns.getSymbolId);
                        resolve(symbol);
                    })
                    .start();
            })
            tweenPromise.push(p);
        })

        await Promise.all(tweenPromise)
            .then(() => {
                //清空symbolAdd
                this.symbolAdd.splice(0, this.symbolAdd.length);
                this.symbolGroup.children.forEach(node => {
                    let symbolIns = node.getComponent(Symbol);
                    // console.log(`最終狀態 symbol id:${symbolIns.getSymbolId} 符號:${symbolIns.GetSymbolName} 滾輪序數:${this._reelBarId}`);
                })
            })
            .catch((err) => { console.error(err); });
    }


    private symbolRolling() {
        if (!this.isRolling) return;

        if (this.isQuickStop) { //手動急停
            this.resultIndex++;

            // 已取完所有的最終盤面 可視範圍外的頂部由基本盤面接續
            if (this.resultIndex != 0 && this.resultIndex >= this.resultReelData.length) {
                this.isResult = false;
            }

            if (this.rollingRestOfSymbols == 0) {
                this.isQuickStop = false;
                this.rolledSymbolCount = 0;
                this.symbolBounce();
                return;
            }
        } else {                //自動停止
            // 以可視範圍的symbol數量為主 加上頂部框外的固定一顆symbol (this.symbolCountFOV + 1)
            // 轉動至第幾次開始取得最終盤面結果
            if (this.rolledSymbolCount == this.rollingSymbolMinimumCount - (this.symbolCountFOV + 1)) {
                this.isResult = true;
            }

            // 已取完所有的最終盤面 可視範圍外的頂部由基本盤面接續
            if (this.resultIndex != 0 && this.resultIndex >= this.resultReelData.length) {
                this.isResult = false;
                this.resultIndex = 0;
            }

            if (this.rolledSymbolCount >= this.rollingSymbolMinimumCount) {
                this.rolledSymbolCount = 0;
                this.symbolBounce();
                return;
            }
        }

        let rollingSpeed = this.rollingSpeed;

        // 提供下一次要出現的Symbol索引值 並且每次都能從停留的Symbol接續
        this.nextReelDataIndex++;
        if (this.nextReelDataIndex >= this.fakeReelData.length) { //超出盤面範圍則從頭開始
            this.nextReelDataIndex = this.nextReelDataIndex % this.fakeReelData.length;
        }

        // 所有Symbol一起滾動
        for (let i = 0; i < this.symbolNode.length; i++) {
            let symbolIns = this.symbolNode[i].getComponent(Symbol);
            if (this.isResult) {
                // console.log(" 準備最終資料 index:", this.resultIndex)
                symbolIns.rolling(rollingSpeed, this.nextReelDataIndex, this.resultIndex);
            } else {
                symbolIns.rolling(rollingSpeed, this.nextReelDataIndex);
            }
        }

        this.rolledSymbolCount++;
        if (this.isQuickStop) this.rollingRestOfSymbols--; //急停時使用倒數計算還要滾動幾次
        if (this.isResult && !this.isQuickStop) this.resultIndex++; //自動停止(排除急停模式)時 由0開始按順序取得最終盤面資料
    }

    private setResultDate(result: string[]) {
        this.resultReelData = result;
        for (let i = 0; i < this.symbolNode.length; i++) {
            let symbolIns = this.symbolNode[i].getComponent(Symbol);
            symbolIns.setResultData(result);
        }
    }

    private symbolBounce() {
        for (let i = 0; i < this.symbolNode.length; i++) {
            let symbolIns = this.symbolNode[i].getComponent(Symbol);
            symbolIns.bounce();
        }
    }

    private allSymbolBounce() {
        this.symbolGroup.children.forEach(node => {
            let symbolIns = node.getComponent(Symbol);
            symbolIns.bounce();
        })
    }

    private specificSymbolBounce(id: number) {
        this.symbolGroup.children.forEach(node => {
            let symbolIns = node.getComponent(Symbol);
            if (symbolIns.getSymbolId == id) {
                symbolIns.bounce();
            }
        })
    }

    public closeAllMultiple() {
        this.symbolGroup.children.forEach(node => {
            node.getChildByName("Multiple").active = false;
        })
    }

    public reset() {
        this.symbolGroup.children.forEach(node => {
            let symbolIns = node.getComponent(Symbol);
            symbolIns.reset();
        })
    }

    update(deltaTime: number) {

    }
}

// todo: 以下資訊可能移至Symbol.ts 或是 AssetsProxy
export interface SymbolSpriteResult {
    spriteFrame: SpriteFrame; // symbol圖片
    scale: Vec3;              // symbol縮放比例
}

export interface SpriteInfo {
    spriteName: string,
    scale: number,
}

// todo: 與參考圖片調整每個symbol尺寸
export const SymbolSpriteSetting = {
    "N1": <SpriteInfo>{ spriteName: "img_symbol_N1", scale: 0.8 },
    "N2": <SpriteInfo>{ spriteName: "img_symbol_N2", scale: 0.5 },
    "N3": <SpriteInfo>{ spriteName: "img_symbol_N3", scale: 0.5 },
    "N4": <SpriteInfo>{ spriteName: "img_symbol_N4", scale: 0.5 },
    "N5": <SpriteInfo>{ spriteName: "img_symbol_N5", scale: 0.5 },
    "H1": <SpriteInfo>{ spriteName: "img_symbol_H1", scale: 0.5 },
    "H2": <SpriteInfo>{ spriteName: "img_symbol_H2", scale: 0.5 },
    "H3": <SpriteInfo>{ spriteName: "img_symbol_H3", scale: 0.5 },
    "H4": <SpriteInfo>{ spriteName: "img_symbol_H4", scale: 0.5 },
    "S1": <SpriteInfo>{ spriteName: "img_symbol_S1", scale: 0.5 },
    "S2": <SpriteInfo>{ spriteName: "img_symbol_S2", scale: 0.5 },
    "S3": <SpriteInfo>{ spriteName: "img_symbol_S3", scale: 0.5 },
    "S4": <SpriteInfo>{ spriteName: "img_symbol_S4", scale: 0.5 },
    "F": <SpriteInfo>{ spriteName: "img_symbol_F", scale: 0.5 },
}

export interface SymbolDragonBonesResult {
    dragonAsset: dragonBones.DragonBonesAsset,
    dragonAtlasAsset: dragonBones.DragonBonesAtlasAsset,
    armatureName: string,
    animationName: string,
    scale: Vec3,
}

export interface DragonBoneInfo {
    dragonAsset: string,
    dragonAtlasAsset: string,
    armatureName: string,
    animationName: string,
    scale: number,
}

export const SymbolDragonBonesSetting = {
    "N1": <DragonBoneInfo>{ dragonAsset: "symbolAKQJTE_ske", dragonAtlasAsset: "symbolAKQJTE_tex", armatureName: "symbolAKQJTE", animationName: "play_A", scale: 0.8 },
    "N2": <DragonBoneInfo>{ dragonAsset: "symbolAKQJTE_ske", dragonAtlasAsset: "symbolAKQJTE_tex", armatureName: "symbolAKQJTE", animationName: "play_Q", scale: 0.8 },
    "N3": <DragonBoneInfo>{ dragonAsset: "symbolAKQJTE_ske", dragonAtlasAsset: "symbolAKQJTE_tex", armatureName: "symbolAKQJTE", animationName: "play_TE", scale: 0.8 },
    "N4": <DragonBoneInfo>{ dragonAsset: "symbolAKQJTE_ske", dragonAtlasAsset: "symbolAKQJTE_tex", armatureName: "symbolAKQJTE", animationName: "play_K", scale: 0.8 },
    "N5": <DragonBoneInfo>{ dragonAsset: "symbolAKQJTE_ske", dragonAtlasAsset: "symbolAKQJTE_tex", armatureName: "symbolAKQJTE", animationName: "play_J", scale: 0.8 },
    "H1": <DragonBoneInfo>{ dragonAsset: "symbolM2_ske", dragonAtlasAsset: "symbolM2_tex", armatureName: "symbolM2", animationName: "play", scale: 0.8 },
    "H2": <DragonBoneInfo>{ dragonAsset: "symbolM3_ske", dragonAtlasAsset: "symbolM3_tex", armatureName: "symbolM3", animationName: "play", scale: 0.8 },
    "H3": <DragonBoneInfo>{ dragonAsset: "symbolM4_ske", dragonAtlasAsset: "symbolM4_tex", armatureName: "symbolM4", animationName: "play", scale: 0.8 },
    "H4": <DragonBoneInfo>{ dragonAsset: "symbolM1_ske", dragonAtlasAsset: "symbolM1_tex", armatureName: "symbolM1", animationName: "play", scale: 0.8 },
    "S1": <DragonBoneInfo>{ dragonAsset: "symbolF1234_ske", dragonAtlasAsset: "symbolF1234_tex", armatureName: "symbolF1234", animationName: "play_F4", scale: 0.7 },
    "S2": <DragonBoneInfo>{ dragonAsset: "symbolF1234_ske", dragonAtlasAsset: "symbolF1234_tex", armatureName: "symbolF1234", animationName: "play_F1", scale: 0.8 },
    "S3": <DragonBoneInfo>{ dragonAsset: "symbolF1234_ske", dragonAtlasAsset: "symbolF1234_tex", armatureName: "symbolF1234", animationName: "play_F3", scale: 0.8 },
    "S4": <DragonBoneInfo>{ dragonAsset: "symbolF1234_ske", dragonAtlasAsset: "symbolF1234_tex", armatureName: "symbolF1234", animationName: "play_F2", scale: 0.8 }, //todo:還有play_F2_hit 之後再觀察運用時機
    "F": <DragonBoneInfo>{ dragonAsset: "symbolB1_ske", dragonAtlasAsset: "symbolB1_tex", armatureName: "symbolB1", animationName: "play", scale: 0.8 }, //todo:還有play_hit、play_expect 之後再觀察運用時機
}