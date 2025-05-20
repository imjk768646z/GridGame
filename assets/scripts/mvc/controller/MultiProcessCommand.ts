import { GameFacade } from "../../GameFacade";
import { ICommand, INotification, IProxy, MacroCommand, Mediator, Proxy, SimpleCommand } from "../../puremvc-typescript-standard-framework";

export class MultiProcessCommand extends MacroCommand {
    public initializeMacroCommand() {
        this.addSubCommand(this.modelPrepCommand);
        this.addSubCommand(this.viewPrepCommand);
        // this.addSubCommand(this.spinPrepCommand);
    }

    private modelPrepCommand(): ICommand {
        return new ModelPrepCommand();
    }

    private viewPrepCommand(): ICommand {
        return new ViewPrepCommand();
    }

    private spinPrepCommand(): ICommand {
        return new SpinCommand();
    }
}

// Model初始化 由MacroCommand呼叫
export class ModelPrepCommand extends SimpleCommand {
    // 這裡的Command並沒有操作或初始任何的Model資料。Proxy的職責才是取得，建立，和初始化資料模型。
    public execute(notification: INotification): void {
        const gameFacade = GameFacade.getInstance() as GameFacade;
        // 建立Proxy實例並註冊
        gameFacade.registerProxy(new SearchProxy("SearchProxy", { key: "1000", callback: () => { console.log("function 1000") } }));
        gameFacade.registerProxy(new PrefsProxy());
        gameFacade.registerProxy(new SpinProxy("SpinProxy", { credit: 1000 }));
        console.log("ModelPrepCommand => ", notification);
    }
}

// 建立Mediator並註冊到View
export class ViewPrepCommand extends SimpleCommand {
    public execute(notification: INotification): void {
        const gameFacade = GameFacade.getInstance() as GameFacade;
        // gameFacade.registerMediator(new GameMediator("GameMediator"));
        console.log("ViewPrepCommand => ", notification);
    }
}

// 需另外開啟獨立腳本或建立在主程式
export class SpinCommand extends SimpleCommand {
    public execute(notification: INotification): void {
        const gameFacade = GameFacade.getInstance() as GameFacade;
        const SpinProxy = gameFacade.retrieveProxy("SpinProxy") as SpinProxy;
        SpinProxy.canSpin();
    }
}

// 需另外開啟獨立腳本或建立在主程式
export class SearchProxy extends Proxy {
    public onRegister(): void {
        console.log("onRegister SearchProxy");
    }

    public searchFile(): string {
        return "Not Found!";
    }
}

// 需另外開啟獨立腳本或建立在主程式
export class PrefsProxy extends Proxy {
    public onRegister(): void {
        console.log("onRegister PrefsProxy");
    }
}

export class SpinProxy extends Proxy implements IProxy {
    public onRegister(): void {
        console.log("onRegister SpinProxy");
    }

    // 須由外部註冊監聽
    public canSpin() {
        this.sendNotification("B");
    }
}