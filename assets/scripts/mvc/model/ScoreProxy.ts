import { Proxy } from '../../puremvc-typescript-standard-framework';
import { BetProxy } from './BetProxy';

/**
 * NG/FG流程在進行消除時，使用GetScore讓消除贏分和贏分顯示共同分數
 * NG流程在進行倍數處理時，使用GetMultiple取得當前圖標倍數，之後在消除贏分自行做乘法計算，使用GetScore讓贏分顯示分數
 * FG流程在進行消除時，使用GetScore讓贏分顯示分數，使用GetEliminateScore讓消除贏分顯示分數。
 * FG流程在進行倍數處理時，使用GetMultiple取得當前圖標倍數，之後在消除贏分自行做乘法計算，使用GetScore讓贏分顯示分數
 */
export class ScoreProxy extends Proxy {
    public static NAME: string = "ScoreProxy";

    private _eliminateScore: number = 0; //每局結束後或是進入FG清空
    private _winScore: number = 0; //每局結束後清空
    private _multiple: number = 0; //圖標倍數

    constructor() {
        super(ScoreProxy.NAME);
    }

    //WaitState狀態要將這裡所有變數歸零

    //每次取得score 都將分數存放在_winScore
    //因此下一次再取得score，_winScore + score 同時把分數存一份給EliminateScoreComponent 也存一份給MainInformationComponent
    public set SetScore(score: number) {
        // if (this._winScore == 0) this._winScore = score;
        // else this._winScore += score;
        if (this._winScore == 0) this._winScore = score * this.betMultiple();
        else this._winScore += score * this.betMultiple();
    }

    private betMultiple(): number {
        const betProxy = this.facade.retrieveProxy(BetProxy.NAME) as BetProxy;
        return betProxy.GetCurrentBetMultiple;
    }

    // 這是給贏分使用的
    public get GetScore(): number {
        return this._winScore;
    }
    //每次取得multiple ex:2x 都將倍數存一份給EliminateScoreComponent讓它做乘法運算 這裡將(_winScore * 2)的結果存放在_winScore 同時將運算結果存一份給MainInformationComponent
    public set SetMultiple(multiple: number) {
        this._multiple = multiple;
        if (this._winScore != 0) this._winScore *= multiple;
    }

    // 消除贏分從這裡取得倍數後自行做乘法計算，因此消除贏分不用取得GetScore
    public get GetMultiple(): number {
        return this._multiple;
    }

    public reset() {
        this._eliminateScore = 0;
        this._winScore = 0;
        this._multiple = 0;
    }

    /* public get GetWinScore(): number {
        return this._winScore;
    } */

    //處理FG流程
    //每次取得score 都將分數存放在_winScore和_eliminateScore
    //因此下一次再取得score，_winScore + score，並且把score存放在_eliminateScore，同時把_eliminateScore存一份給EliminateScoreComponent，_winScore存一份給MainInformationComponent
    public set SetScoreFGState(score: number) {
        this.SetScore = score;
        this._eliminateScore = score * this.betMultiple();
    }

    public set SetMultipleFGState(multiple: number) {
        this._multiple = multiple;
        this._eliminateScore *= multiple;
        if (this._winScore != 0) this._winScore = this._winScore + this._eliminateScore;
    }

    // 這是給消除贏分使用的
    public get GetEliminateScore(): number {
        return this._eliminateScore;
    }
    //每次取得multiple ex:2x 都將倍數存一份給EliminateScoreComponent讓它做乘法運算 這裡將(_winScore * 2)的結果存放在_winScore 同時將運算結果存一份給MainInformationComponent

    public onRegister(): void {
        // console.log("ScoreProxy's data:", this.data);
    }


}

