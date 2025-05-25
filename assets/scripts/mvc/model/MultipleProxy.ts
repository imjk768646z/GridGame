import { Proxy } from '../../puremvc-typescript-standard-framework';

export class MultipleProxy extends Proxy {
    public static NAME: string = "MultipleProxy";
    private _multipleSymbolPos: MultipleSymbolInfo[][];
    // private _multipleSymbolPos: MultipleSymbolInfo[];

    private mainIndex: number = 0;

    private handleMutipleIndexList = [];

    constructor() {
        super(MultipleProxy.NAME);
    }

    public onRegister(): void {
        // console.log("MultipleProxy's data:", this.data);
    }

    public set SetMultipleSymbol(data: MultipleSymbolInfo[][]) {
        this._multipleSymbolPos = data;
        for (let i = 0; i < this._multipleSymbolPos.length; i++) {
            if (this._multipleSymbolPos[i].length > 0) {
                this.handleMutipleIndexList.push(i);
            }
        }
        // console.log("總共要處理的倍數索引值:", this.handleMutipleIndexList);
    }

    /* public set SetMultipleSymbol(data: MultipleSymbolInfo[]) {
        this._multipleSymbolPos = data;
    } */

    // 取得目前出現倍數的位置
    public getCurrentMultiplePos(): MultipleSymbolInfo[] {
        // const SingleReelSymbolPos = this._multipleSymbolPos[this.mainIndex];

        // this.mainIndex++;
        // return SingleReelSymbolPos;

        let todoIndex = this.handleMutipleIndexList.shift();
        const SingleReelSymbolPos = this._multipleSymbolPos[todoIndex];
        return SingleReelSymbolPos;
    }

    /* public getCurrentMultiplePos(): MultipleSymbolInfo {
        const SingleReelMultipleSymbolPos = this._multipleSymbolPos.shift();
        return SingleReelMultipleSymbolPos;
    } */

    public hasNextMultipleSymbol(): boolean {
        /* if (this.mainIndex <= this._multipleSymbolPos.length - 1) {
            return true;
        } else {
            return false;
        } */
        if (this.handleMutipleIndexList.length > 0) return true;
        else return false;
        /* if (this._multipleSymbolPos.length > 0) return true;
        else return false; */
    }
}

export interface MultipleSymbolInfo {
    reelBarOrdinal: number; //第幾個滾輪
    symbolOrdinal: number;  //第幾個圖標
    multiplText: string;    //倍數標籤
}
