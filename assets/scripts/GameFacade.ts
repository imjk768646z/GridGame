import { MultiProcessCommand } from "./mvc/controller/MultiProcessCommand";
import { StartCommand } from "./mvc/controller/StartCommand";
import { SpinCommand } from "./mvc/controller/SpinCommand";
import { Facade, IFacade, ICommand, MacroCommand, INotification, SimpleCommand } from "./puremvc-typescript-standard-framework";
import { LoadCommand } from "./mvc/controller/LoadCommand";
import { InitCommand } from "./mvc/controller/InitCommand";
import { AssetsSavedCommand } from "./mvc/controller/AssetsSavedCommand";
import { RemoveStateCommand } from "./mvc/controller/RemoveStateCommand";
import { MultipleHandleStateCommand } from "./mvc/controller/MultipleHandleStateCommand";
import { WaitStateCommand } from "./mvc/controller/WaitStateCommand";
import { FGRemoveStateCommand } from "./mvc/controller/FGRemoveStateCommand";
import { FGTriggerStateCommand } from "./mvc/controller/FGTriggerStateCommand";
import { FGMultipleHandleStateCommand } from "./mvc/controller/FGMultipleHandleStateCommand";
import { NGSpinStateCommand } from "./mvc/controller/NGSpinStateCommand";

// 宣告Notification變數
export const STARTUP: string = "startup";
export const MULTIPROCESS: string = "multiprocess";

export class GameFacade extends Facade implements IFacade {

    // 宣告Notification變數
    // public static STARTUP: string = "startup";
    public static START_SPIN: string = "START_SPIN";
    public static ASSETS_SAVED: string = "ASSETS_SAVED";
    // 以下是和狀態機對應的命令 切換狀態機有需要執行動畫才需要該命令
    public static LOAD: string = "LOAD"; //LoadState
    public static INIT: string = "INIT"; //InitState
    public static WAIT: string = "WAIT"; //WaitState
    public static NGSPIN: string = "NGSPIN"; //NGSpinState
    public static REMOVE: string = "REMOVE"; //RemoveState
    public static FGTRIGGER: string = "FGTRIGGER"; //FGTriggerState
    public static FGREMOVE: string = "FGREMOVE"; //FGRemoveState
    public static MULTIPLE_HANDLE: string = "MULTIPLE_HANDLE";
    public static FGMULTIPLE_HANDLE: string = "FGMULTIPLE_HANDLE";

    // 獲取GameFacade單例的工廠方法
    public static getInstance(): IFacade {
        if (this.instance == null) this.instance = new GameFacade();
        // return this.instance as GameFacade;
        return <GameFacade>this.instance;
    }

    // 註冊Command 建立Command與Notification之間的關聯
    protected initializeController(): void {
        super.initializeController();
        this.registerCommand(STARTUP, this.startCommand);
        this.registerCommand(GameFacade.ASSETS_SAVED, this.assetsSavedCommand);
        // this.registerCommand(GameFacade.LOAD, this.loadCommand);
        this.registerCommand(GameFacade.INIT, this.initCommand);
        this.registerCommand(GameFacade.WAIT, this.waitStateCommand);
        this.registerCommand(GameFacade.NGSPIN, this.ngSpinStateCommand);
        this.registerCommand(GameFacade.REMOVE, this.removeStateCommand);
        this.registerCommand(GameFacade.FGTRIGGER, this.fgTriggerStateCommand);
        this.registerCommand(GameFacade.FGREMOVE, this.fgRemoveStateCommand);
        this.registerCommand(GameFacade.MULTIPLE_HANDLE, this.multipleHandleStateCommand);
        this.registerCommand(GameFacade.FGMULTIPLE_HANDLE, this.fgMultipleHandleStateCommand);
        // this.registerCommand(MULTIPROCESS, this.multiProcessCommand);
        this.registerCommand(GameFacade.START_SPIN, this.spinCommand);
    }

    private startCommand(): ICommand {
        return new StartCommand();
    }

    private assetsSavedCommand(): ICommand {
        return new AssetsSavedCommand();
    }

    private loadCommand(): ICommand {
        return new LoadCommand();
    }

    private initCommand(): ICommand {
        return new InitCommand();
    }

    private waitStateCommand(): ICommand {
        return new WaitStateCommand();
    }

    private ngSpinStateCommand(): ICommand {
        return new NGSpinStateCommand();
    }

    private removeStateCommand(): ICommand {
        return new RemoveStateCommand();
    }

    private fgTriggerStateCommand(): ICommand {
        return new FGTriggerStateCommand();
    }

    private fgRemoveStateCommand(): ICommand {
        return new FGRemoveStateCommand();
    }

    private multipleHandleStateCommand(): ICommand {
        return new MultipleHandleStateCommand();
    }

    private fgMultipleHandleStateCommand(): ICommand {
        return new FGMultipleHandleStateCommand();
    }

    private multiProcessCommand(): ICommand {
        return new MultiProcessCommand();
    }

    private spinCommand(): ICommand {
        return new SpinCommand();
    }

    // 啟動PureMVC 在主程式呼叫此方法 並傳遞相關腳本
    public startup(gameScene?: any) { //參數是來自主程式的任何資訊
        this.sendNotification(STARTUP, gameScene);
    }

    public multiProcess(app?: any) {
        this.sendNotification(MULTIPROCESS, this);
    }
}