import { AudioClip, dragonBones, JsonAsset, resources, SpriteFrame } from "cc";
import { GameFacade } from "../../../GameFacade";
import { FSMProxy, IFSMEvent } from "../../../mvc/model/FSMProxy";
import { SlotProxy } from "../../../mvc/model/SlotProxy";
import { StateBase } from "../StateBase";
import { GameState } from "../GameState";
import { SignalAction } from "../../../Definition";
import { AssetsProperty } from "../../../mvc/controller/AssetsSavedCommand";
import { AudioEngineControl } from "../../../singleton/AudioEngineControl";

export class LoadState extends StateBase {

    private symbols: Map<string, SpriteFrame> = new Map<string, SpriteFrame>();
    private audioClips: Map<string, AudioClip> = new Map<string, AudioClip>();
    private dragonBones: Map<string, dragonBones.DragonBonesAsset> = new Map<string, dragonBones.DragonBonesAsset>();
    private dragonBonesAtlas: Map<string, dragonBones.DragonBonesAtlasAsset> = new Map<string, dragonBones.DragonBonesAtlasAsset>();

    private funcs = [
        this.loadSprites.bind(this),
        // this.loadDragonBone.bind(this),
        this.loadAudio.bind(this),
        this.loadDragonBones.bind(this),
        this.loadDragonBonesAtlas.bind(this),
        this.loadTest.bind(this),
    ];

    private funcsIdx = 0;

    onEnter(from?: GameState, event?: IFSMEvent): boolean {
        console.log("LoadState onEnter");
        return true;
    }

    async on(from?: GameState, event?: IFSMEvent) {
        super.on(from, event);
        console.log("LoadState on");

        await this.nextLoad("載入圖片", true);

        console.log("完成所有資源載入");

        // 在這裡載入所有資源 每載完一個種類使用sendNotification 通知LoadScene更新讀取進度
        // 最後將該腳本傳遞給AssetsProxy 之後再設定給需要該資源的腳本
        // 執行AssetsSavedCommand 將所有資源存入AssetsProxy
        let assets = <AssetsProperty>{
            symbols: this.symbols,
            audioClips: this.audioClips,
            dragonBones: this.dragonBones,
            dragonBonesAtlas: this.dragonBonesAtlas,
        };
        event.facade.sendNotification(GameFacade.ASSETS_SAVED, assets);

        //切換狀態機到INIT 觸發動畫完成後續事件
        //切換之前先執行InitCommand 設定初始化該具備的資料 例如:滾輪
        //切換到Init狀態因為有動畫 需要事先設定資料 因此使用通知觸發InitCommand 先將資料設定給動畫會用到的相關腳本
        //但是這樣很奇怪 這裡是LoadState載入階段 直接做了下一個階段才要做的事情 不符合邏輯
        //應該在切換LoadState狀態之前 先執行LoadCommand 讓動畫先具備執行期間會用到的資料 如果沒有動畫則不需要執行LoadCommand
        //然後在StateBase先使用通知強制執行命令 才執行動畫
        const fsmProxy = event.facade.retrieveProxy(FSMProxy.NAME) as FSMProxy;
        event.fsm.go(GameState.Init, fsmProxy.fsmEvent(GameFacade.INIT, SignalAction.NG.Init));
    }

    /* onExit(from?: GameState, event?: any) {
        console.log("LoadState onExit");
        return true;
    } */

    // todo:所有資源載入都要做防呆機制
    private loadSprites() {
        return new Promise(res => {
            resources.loadDir("/images/symbols", SpriteFrame, async (err, sprites) => {
                if (err) {
                    res(null);
                } else {
                    sprites.forEach(sprite => {
                        this.symbols.set(sprite.name, sprite);
                    })
                    await this.nextLoad("載入音樂", true);
                    res(sprites);
                }
            })
        })
    }

    private loadAudio(): Promise<AudioClip[]> {
        return new Promise(res => {
            resources.loadDir("/audio", AudioClip, async (err, audio) => {
                if (err) {
                    res(null);
                } else {
                    audio.forEach((audio) => {
                        AudioEngineControl.getInstance().setAudioTask(audio.name, audio);
                        this.audioClips.set(audio.name, audio);
                    })
                    // await this.nextLoad("", false);
                    await this.nextLoad("載入骨骼數據", true);
                    res(audio);
                }
            })
        })
    }

    private loadDragonBones(): Promise<dragonBones.DragonBonesAsset[]> {
        return new Promise(res => {
            resources.loadDir("/animation", dragonBones.DragonBonesAsset, async (err, assets) => {
                if (err) {
                    res(null);
                } else {
                    assets.forEach((dragonBones) => {
                        this.dragonBones.set(dragonBones.name, dragonBones);
                    })
                    await this.nextLoad("載入圖集數據", true);
                    res(assets);
                }
            })
        })
    }

    private loadDragonBonesAtlas(): Promise<dragonBones.DragonBonesAtlasAsset[]> {
        return new Promise(res => {
            resources.loadDir("/animation", dragonBones.DragonBonesAtlasAsset, async (err, assets) => {
                if (err) {
                    res(null);
                } else {
                    assets.forEach((dragonBones) => {
                        this.dragonBonesAtlas.set(dragonBones.name, dragonBones);
                    })
                    await this.nextLoad("載入測試", true);
                    res(assets);
                }
            })
        })
    }

    private loadTest(): Promise<string> {
        return new Promise(res => {
            setTimeout(async () => {
                await this.nextLoad("", false);
                res("success");
            }, 1000);
        })
    }

    private async nextLoad(msg: string, isNext: boolean = false) {
        console.log("準備載入:", msg, " 是否載入下一個資源:", isNext);
        if (isNext) {
            if (this.funcsIdx < this.funcs.length) {
                let func = this.funcs[this.funcsIdx];
                this.funcsIdx++;
                if (func) {
                    // this.loadingMsg.string = msg;
                    // this.progressBar.progress = this.funcsIdx / this.funcs.length;
                    // todo: 將progress計算結果放在參數傳遞給Mediator
                    const progress = this.funcsIdx / this.funcs.length;
                    const body = { progress: progress, msg: msg };
                    this.event.facade.sendNotification("UPDATE_PROGRESS", body);
                    await func();
                }

            }
        } else {
            // 資源載入完成，關閉該節點
            // this.node.active = false;
            // this.event.facade.sendNotification("LOADING_END"); //這裡不用通知的方式關閉節點


            //todo: 切換狀態機到INIT 觸發動畫完成後續事件
            //切換之前先執行InitCommand 設定初始化該具備的資料 例如:滾輪
            // const fsmProxy = this.event.facade.retrieveProxy(FSMProxy.NAME) as FSMProxy;
            // console.log("切換到INIT狀態")
            // this.event.fsm.go(GameState.Init, fsmProxy.fsmEvent(SignalAction.NG.Init));
        }
    }

    call(): void {
        console.log("動畫結束");
    }
}


