import { Proxy } from '../../puremvc-typescript-standard-framework';

export class BetProxy extends Proxy {
    public static NAME: string = "BetProxy";

    private _betLevel = [0.2, 0.4, 0.6, 0.8, 1.0, 1.6, 2, 3, 6, 8, 10, 20, 40, 60, 100, 200, 400, 600, 800, 1000, 1200, 1500, 2000];
    private _defaultBet = 0.2;
    private _currentBet = 0;
    private _betMultiple = 0;

    constructor() {
        super(BetProxy.NAME);
        this._currentBet = this._defaultBet;
        this.updateBetMultiple();
    }

    public onRegister(): void {
        // console.log("BetProxy's data:", this.data);
    }

    public get GetCurrentBet(): number {
        return this._currentBet;
    }

    public get GetCurrentBetMultiple(): number {
        return this._betMultiple;
    }

    // 更新投注的級距
    private updateBetMultiple() {
        this._betMultiple = this._betLevel.indexOf(this._currentBet) + 1;
    }

    public raiseBet() {
        let curIndex = this._betLevel.indexOf(this._currentBet);
        if (curIndex + 1 < this._betLevel.length) {
            curIndex++;
        }
        this._currentBet = this._betLevel[curIndex];
        this.updateBetMultiple();
        return this._currentBet;
    }

    public reduceBet() {
        let curIndex = this._betLevel.indexOf(this._currentBet);
        if (curIndex - 1 >= 0) {
            curIndex--;
        }
        this._currentBet = this._betLevel[curIndex];
        this.updateBetMultiple();
        return this._currentBet;
    }
}


