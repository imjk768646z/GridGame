import { _decorator, Component, Node, Vec3 } from 'cc';
import { ReelBar } from './ReelBar';
import { AssetsProperty } from '../mvc/controller/AssetsSavedCommand';
import { AddSignal, SignalManager } from '../singleton/SignalManager';
import { SignalType, SoundList } from '../Definition';
import { ISignal } from './Signal';
import { MultipleInfo, RemoveRule, RemoveSymbolRule } from '../mvc/model/SlotProxy';
import { MultipleSymbolInfo } from '../mvc/model/MultipleProxy';
import { AudioEngineControl } from '../singleton/AudioEngineControl';

const { ccclass, property } = _decorator;

@ccclass('ReelControl')
export class ReelControl extends Component {

    @property(ReelBar)
    reelBars: Array<ReelBar> = [];

    private _baseReelData: string[][] = null; //這邊由通知設定過來

    private _assets: AssetsProperty = null;

    private _removeSymbolData: number[][] = null;

    onLoad() {
        AddSignal(SignalType.ShowSymbolFrame, this.onShowSymbolFrame.bind(this));
        AddSignal(SignalType.ShowSymbolDynamic, this.onShowSymbolDynamic.bind(this));
        AddSignal(SignalType.ShowFreeSymbolDynamic, this.onShowFreeSymbolDynamic.bind(this));
        AddSignal(SignalType.ShowSingleSymbolDynamic, this.onShowSingleSymbolDynamic.bind(this));
        AddSignal(SignalType.ShowSymbolEliminate, this.onShowSymbolEliminate.bind(this));
        AddSignal(SignalType.RemoveSymbol, this.onRemoveSymbol.bind(this));
        AddSignal(SignalType.FillSymbol, this.onFillSymbol.bind(this));
        AddSignal(SignalType.UpdateMultipleText, this.onUpdateMultipleText.bind(this));
        AddSignal(SignalType.CloseSymbolMultiple, this.onCloseSymbolMultiple.bind(this));
    }

    public set SetBaseReelData(reelData: string[][]) {
        this._baseReelData = reelData;
    }

    public set SetAssets(assets: AssetsProperty) {
        this._assets = assets;
        // console.log("拿到所有資源:", this._assets);
        this.reelBars.forEach(reelbar => {
            reelbar.SetAssets = assets;
        });
    }

    private _removeSymbolRule: RemoveSymbolRule = null;
    public set SetRemoveSymbolRule(data: RemoveSymbolRule) {
        this._removeSymbolRule = data;
        this.reelBars.forEach((reelBar, index) => {
            reelBar.SetRemoveSymbolRule(data.updateReelData[index], data.removePos[index], data.multipleInfo.pos[index], data.multipleInfo.text[index]);
        });
    }

    // 從每個滾輪中的圖標中搜尋含有S系列的圖標
    public searchMultipleSymbol(): MultipleSymbolInfo[][] {
        let allSymbolPos = [];
        this.reelBars.forEach(reelBar => {
            let multiplePos = reelBar.searchMultipleSymbol();
            allSymbolPos.push(multiplePos);
        })
        return allSymbolPos;
    }

    private _multipleSymbolPos: MultipleSymbolInfo[] = [];
    public set SetMultipleSymbolPos(data: MultipleSymbolInfo[]) {
        this._multipleSymbolPos = data;
        console.log("! 等一下要關閉的倍數資訊:", this._multipleSymbolPos);
    }

    private totalSymbolToShowFrame = 0; //要顯示外框的symbol加總
    private onShowSymbolFrame(event: ISignal) {
        AudioEngineControl.getInstance().playAudio(SoundList.ShowFrameStart, 1);
        // 計算總共有幾個symbol要顯示外框
        this._removeSymbolRule.removePos.forEach(symbolToRemove => {
            this.totalSymbolToShowFrame += symbolToRemove.length;
        })
        // 讓每個滾輪在即將要移除的symbol上顯示外框
        this.reelBars.forEach((reelBar) => {
            reelBar.showFrame(this.onShowFrameComplete, this);
        })
    }

    private showFrameCount = 0; //顯示外框的次數
    // 每個symbol顯示外框後的回呼事件
    private onShowFrameComplete() {
        this.showFrameCount++;
        // 當顯示外框的次數達到上限，通知動畫排程已完成
        if (this.showFrameCount >= this.totalSymbolToShowFrame) {
            AudioEngineControl.getInstance().playAudio(SoundList.ShowFrameEnd, 1);
            SignalManager.CallBack(SignalType[SignalType.ShowSymbolFrame]);
            // 結束後隱藏外框
            this.reelBars.forEach((reelBar) => {
                reelBar.hideAllFrame();
            })
            this.showFrameCount = 0;
            this.totalSymbolToShowFrame = 0;
        }
    }

    private totalSymbolToShowDynamic = 0; //要顯示動態圖示的symbol加總
    private onShowSymbolDynamic(event: ISignal) {
        // 計算總共有幾個symbol要顯示動態圖示
        this._removeSymbolRule.removePos.forEach(symbolToRemove => {
            this.totalSymbolToShowDynamic += symbolToRemove.length;
        })
        this.reelBars.forEach((reelBar) => {
            reelBar.showDynamic(this.onShowDynamicComplete, this);
        })
    }

    private showDynamicCount = 0; //顯示動態圖示的次數
    private onShowDynamicComplete() {
        this.showDynamicCount++;
        // 當顯示動態圖示的次數達到上限，通知動畫排程已完成
        if (this.showDynamicCount >= this.totalSymbolToShowDynamic) {
            SignalManager.CallBack(SignalType[SignalType.ShowSymbolDynamic]);
            // 結束後隱藏動態節點
            this.reelBars.forEach((reelBar) => {
                reelBar.hideAllDynamic();
            })
            this.showDynamicCount = 0;
            this.totalSymbolToShowDynamic = 0;
        }
    }

    private totalFreeSymbolToShowDynamic = 0; //要顯示免費圖標動態圖示的symbol加總
    private onShowFreeSymbolDynamic(event: ISignal) {
        AudioEngineControl.getInstance().playAudio(SoundList.FreeGameSymbol, 1);
        this.reelBars.forEach((reelBar) => {
            reelBar.showFreeSymbolDynamic(this.onShowFreeSymbolDynamicComplete, this);
        })
    }

    private showFreeSymbolDynamicCount = 0; //顯示FG動態圖示的次數
    private onShowFreeSymbolDynamicComplete() {
        this.showFreeSymbolDynamicCount++;
        // 當顯示動態圖示的次數達到上限，通知動畫排程已完成
        if (this.showFreeSymbolDynamicCount >= this.totalFreeSymbolToShowDynamic) {
            SignalManager.CallBack(SignalType[SignalType.ShowFreeSymbolDynamic]);
            // 結束後隱藏動態節點
            this.reelBars.forEach((reelBar) => {
                reelBar.hideAllDynamic();
            })
            this.showFreeSymbolDynamicCount = 0;
            this.totalFreeSymbolToShowDynamic = 0;
        }
    }

    private onShowSingleSymbolDynamic(event: ISignal) {
        AudioEngineControl.getInstance().playAudio(SoundList.MultipleSymbol, 1);
        this._multipleSymbolPos.forEach(symbolPos => {
            this.reelBars[symbolPos.reelBarOrdinal - 1].showSingleDynamic(symbolPos.symbolOrdinal, this.onshowSingleDynamicComplete, this);
        })

        // this.reelBars[this._multipleSymbolPos.reelBarOrdinal - 1].showSingleDynamic(this._multipleSymbolPos.symbolOrdinal, this.onshowSingleDynamicComplete, this);

    }

    private onshowSingleDynamicComplete() {
        SignalManager.CallBack(SignalType[SignalType.ShowSingleSymbolDynamic]);
    }

    private totalSymbolToShowEliminate = 0;
    private onShowSymbolEliminate(event: ISignal) {
        AudioEngineControl.getInstance().playAudio(SoundList.NGSymbolEliminate, 1);
        // 計算總共有幾個symbol要顯示消除動畫
        this._removeSymbolRule.removePos.forEach(symbolToRemove => {
            this.totalSymbolToShowEliminate += symbolToRemove.length;
        })
        this.reelBars.forEach((reelBar) => {
            reelBar.showEliminate(this.onShowEliminateComplete, this);
        })
    }

    private showEliminateCount = 0; //顯示消除動畫的次數
    private onShowEliminateComplete() {
        this.showEliminateCount++;
        // 當顯示消除動畫的次數達到上限，通知動畫排程已完成
        if (this.showEliminateCount >= this.totalSymbolToShowEliminate) {
            SignalManager.CallBack(SignalType[SignalType.ShowSymbolEliminate]);
            // 結束後隱藏消除動畫的節點
            this.reelBars.forEach((reelBar) => {
                reelBar.hideAllEliminate();
            })
            this.showEliminateCount = 0;
            this.totalSymbolToShowEliminate = 0;
        }
    }

    private onRemoveSymbol(event: ISignal) {
        const multiPromises: Promise<boolean>[] = [];

        this.reelBars.forEach((reelbar, index) => {
            const p = new Promise<boolean>(async resolve => {
                await reelbar.removeSymbol();
                resolve(true);
            })
            multiPromises.push(p);
        });

        Promise.all(multiPromises)
            .then(() => {
                console.log("!! 所有移除圖標的動畫皆完成");
                event.CallBack();
            })
            .catch((err) => { console.error(err); });
    }

    private onFillSymbol(event: ISignal) {
        const multiPromises: Promise<boolean>[] = [];
        this.reelBars.forEach((reelbar, index) => {
            const p = new Promise<boolean>(async resovle => {
                await reelbar.fillSymbol();
                resovle(true);
            })
            multiPromises.push(p);
        });

        Promise.all(multiPromises)
            .then(() => {
                console.log("所有圖標補足皆完成");
                event.CallBack();
            })
            .catch((err) => { console.error(err); });
    }

    init() {
        this.reelBars.forEach((reelbar, index) => {
            reelbar.SetBaseReelData = this._baseReelData[index];
            reelbar.initailReelBar();
        });
    }

    public spinOut(onComplete: Function) {
        AudioEngineControl.getInstance().playAudio(SoundList.SPINOUT, 1);
        this.reelBars.forEach((reelBar, index) => {
            this.scheduleOnce(() => {
                // 給予最後一個滾輪回呼事件，當所有滾輪移出畫面後，使用回呼將滾輪轉入
                (index == this.reelBars.length - 1) ? reelBar.spinOut(onComplete) : reelBar.spinOut();
                // console.log(`--第${index}個滾輪開始轉動--`);
            }, index * 0.1);
        })
    }

    public spinIn(resultReel: string[][]) {
        this.reelBars.forEach((reelBar, index) => {
            this.scheduleOnce(() => {
                // 給予最後一個滾輪回呼事件，當所有滾輪移出畫面後，使用回呼將滾輪轉入
                reelBar.spinIn(this.reelBars.length, resultReel[index]);
                // console.log(`--第${index}個滾輪開始轉動--`);
            }, index * 0.1);
        })
    }

    public updateMultipleText(mutiInfo: MultipleInfo) {
        this.reelBars.forEach((reelBar, index) => {
            reelBar.updateMultipleText(mutiInfo.pos[index], mutiInfo.text[index]);
        })
    }

    private _multipleInfo: MultipleInfo = null;
    private onUpdateMultipleText(event: ISignal) {
        this.reelBars.forEach((reelBar, index) => {
            reelBar.updateMultipleText(this._removeSymbolRule.multipleInfo.pos[index], this._removeSymbolRule.multipleInfo.text[index]);
        })
        event.CallBack();
    }

    private onCloseSymbolMultiple(event: ISignal) {
        this._multipleSymbolPos.forEach(symbolPos => {
            this.reelBars[symbolPos.reelBarOrdinal - 1].closeAllMultiple();
        })


        // this.reelBars[this._multipleSymbolPos.reelBarOrdinal - 1].closeAllMultiple();

        event.CallBack();
    }

    public spinStop() {
        //todo: 取消每一個滾輪的tween 重新派送tween
    }

    public reset() {
        //reset symbol
        this.reelBars.forEach(reelBar => {
            reelBar.reset();
        })
    }

    public get GetSymbolWorldPosition() {
        let allSymbolWorldPosition: Vec3[][] = [];
        this.reelBars.forEach(reelBar => {
            allSymbolWorldPosition.push(reelBar.GetSymbolWorldPosition);
        })
        return allSymbolWorldPosition;
    }

    start() {

    }

    update(deltaTime: number) {

    }
}


