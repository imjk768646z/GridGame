import { Proxy } from '../../puremvc-typescript-standard-framework';
import { MultipleSymbolInfo } from './MultipleProxy';

export interface RemoveRule {
    removePos: number[][];  //消除圖標的位置 如果有六個滾輪，給予五個元素，0為不需要消除任何圖標，ex:[[0],[1],[2,3],[4,5],[3,4,5],[0]]
    updateReelData: string[][];
}

export interface MultipleRule {
    hasMulti: boolean;
    multiPos: number[][];
    multiText: string[][];
}

export interface SlotFlow {
    fgInfo: FreeGameInfo; //todo: 新增一個介面專門記錄FG的訊息 例:有無FG、分數(要給予正確的分數，例如出現四個F圖標總共是3分，之後要乘以總投注假設0.2，因此最終贏分要顯示0.60)
    spinReelData: SpinReelRule;
    removeSymbolData: RemoveSymbolRule[];
}

export interface FreeGameInfo {
    hasFG: boolean;
    score: number;
}

export interface SpinReelRule {
    updateReelData: string[][];
    multipleInfo: MultipleInfo;
}

export interface RemoveSymbolRule {
    score: number;
    updateReelData: string[][]; //消除後要補足的symbol名稱
    removePos: number[][];
    multipleInfo: MultipleInfo;
}

export interface RemoveInfo {
    pos: number[][];
}

export interface MultipleInfo {
    pos: number[][]; //數字代表第幾顆symbol ex:[[1],[5]] => 總共兩個滾輪，第一個滾輪的第一顆symbol，第二個滾輪的第五顆symbol
    text: string[][];
}

export class SlotProxy extends Proxy {

    constructor() {
        super(SlotProxy.NAME);
        this.initReels();
    }

    public static NAME: string = "SlotProxy";
    private reels: number[][] = [[1, 2, 3], [1, 2, 1], [3, 2, 3], [2, 2, 2], [3, 2, 1]]; //temp test
    // private _baseReelData: string[][] = [["H1", "H2", "H3", "H4", "N1"], ["N2", "N3", "N4", "N5", "S1"]];
    private _baseReelData: string[][] = [["H2", "N4", "N4", "H3", "H3"], ["N4", "N4", "N1", "N1", "N2"], ["H3", "N1", "N1", "N4", "N4"], ["H3", "H2", "H2", "N2", "N2"], ["H4", "N2", "N2", "N3", "N3"], ["N1", "H2", "H2", "N2", "N2"]];

    private _NG_routineScript = [
        //todo: 如果有FG 盤面必須給FG圖標的所在位置
        /* <SlotFlow>{ //有消除 出現一個倍數(需處理)
            fgInfo: { hasFG: false, score: 0 },
            spinReelData: <SpinReelRule>{
                updateReelData: [["N2", "N2", "H3", "H3", "N5"], ["H4", "N1", "N1", "N1", "N2"], ["N3", "N3", "H3", "H3", "N2"], ["H1", "N2", "N2", "H2", "H2"], ["N3", "N1", "N1", "S2", "N3"], ["N2", "N2", "N4", "N5", "F"]],
                multipleInfo: <MultipleInfo>{ pos: [[], [], [], [], [4], []], text: [[], [], [], [], ["2x"], []] }
            },
            removeSymbolData: [
                //依照RemoveSymbolRule依序執行消除動畫
                <RemoveSymbolRule>{ score: 0.10, updateReelData: [["N1", "F"], ["H4"], ["N3"], ["N3", "H1"], [], ["H3", "H3"]], removePos: [[1, 2], [5], [5], [2, 3], [], [1, 2]], multipleInfo: <MultipleInfo>{ pos: [[], [], [], [], [], []], text: [[], [], [], [], [], []] } },
            ]
        },
        <SlotFlow>{ //無消除 出現一個倍數(不處理)
            fgInfo: { hasFG: false, score: 0 },
            spinReelData: <SpinReelRule>{
                updateReelData: [["N2", "N3", "N3", "H2", "H2"], ["H3", "S2", "N2", "N1", "N4"], ["F", "N4", "N4", "H3", "H3"], ["H1", "H2", "H2", "N5", "N5"], ["N4", "N4", "N1", "N1", "H3"], ["H2", "H2", "H3", "H3", "N1"]],
                multipleInfo: <MultipleInfo>{ pos: [[], [2], [], [], [], []], text: [[], ["3x"], [], [], [], []] }
            },
            removeSymbolData: []
        }, */
        <SlotFlow>{ //進入FG
            fgInfo: { hasFG: true, score: 3 },
            spinReelData: <SpinReelRule>{
                updateReelData: [["H2", "H1", "N5", "N1", "H3"], ["N4", "H2", "H1", "N5", "F"], ["N5", "N1", "H3", "N3", "F"], ["N2", "H4", "N4", "F", "H1"], ["N4", "H2", "H1", "F", "N1"], ["H2", "H1", "N5", "N1", "H3"]],
                multipleInfo: <MultipleInfo>{ pos: [[], [], [], [], [], []], text: [[], [], [], [], [], []] }
            },
            removeSymbolData: [
                //依照RemoveSymbolRule依序執行消除動畫
                // <RemoveSymbolRule>{ score: 0.2, updateReelData: [[], ["N5", "H2", "H3"]], removePos: [[], [2, 4, 5]], multipleInfo: <MultipleInfo>{ pos: [[], []], text: [[], []] } },
                // <RemoveSymbolRule>{ score: 0.5, updateReelData: [["H2", "H3"], ["S2"]], removePos: [[2, 5], [2]], multipleInfo: <MultipleInfo>{ pos: [[], [1]], text: [[], ["2x"]] } },
            ]
        },
        // <SlotFlow>{
        //     spinReelData: <SpinReelRule>{
        //         updateReelData: [["N2", "N3", "S4", "F", "H1"], ["H2", "H3", "H4", "N1", "N2"]],
        //         multipleInfo: <MultipleInfo>{ pos: [[3], [0]], text: [["4x"], [""]] }
        //     },
        //     removeSymbolData: [
        //         <RemoveSymbolRule>{ updateReelData: [["N2", "N3"], ["N5", "H2", "H3"]], removePos: [[2, 5], [2, 4, 5]], multipleInfo: <MultipleInfo>{ pos: [[0], [0]], text: [[""], [""]] } },
        //         <RemoveSymbolRule>{ updateReelData: [["H2", "H3"], ["S2"]], removePos: [[3, 5], [2]], multipleInfo: <MultipleInfo>{ pos: [[0], [1]], text: [[""], ["2x"]] } },
        //     ]
        // },
        // <SlotFlow>{},
        // <SlotFlow>{},
    ];

    private _FG_routineScript = [
        <SlotFlow>{
            spinReelData: <SpinReelRule>{
                updateReelData: [["N2", "N2", "N2", "N2", "N2"], ["H4", "H4", "H4", "H4", "H4"], ["N3", "N3", "N3", "N3", "N3"], ["H1", "H1", "H1", "H1", "H1"], ["N2", "S2", "N2", "N2", "N2"], ["N4", "N4", "N4", "N4", "N4"]],
                multipleInfo: <MultipleInfo>{ pos: [[], [], [], [], [2], []], text: [[], [], [], [], ["10x"], []] }
            },
            removeSymbolData: [
                //依照RemoveSymbolRule依序執行消除動畫
                <RemoveSymbolRule>{ score: 2.00, updateReelData: [["H2"], [], ["S3"], [], ["N4"], []], removePos: [[3], [], [4], [], [5], []], multipleInfo: <MultipleInfo>{ pos: [[], [], [1], [], [], []], text: [[], [], ["20x"], [], [], []] } },
                // 第一三五個滾輪消除 並且出現倍數圖標
                // <RemoveSymbolRule>{ score: 2.00, updateReelData: [["H2"], [], ["S3"], [], ["N4"], []], removePos: [[3], [], [4], [], [5], []], multipleInfo: <MultipleInfo>{ pos: [[], [], [1], [], [], []], text: [[], [], ["100x"], [], [], []] } },
                // <RemoveSymbolRule>{ score: 0.5, updateReelData: [["H2", "H3"], ["S2"]], removePos: [[2, 5], [2]], multipleInfo: <MultipleInfo>{ pos: [[], [1]], text: [[], ["2x"]] } },
            ]
        },
        <SlotFlow>{
            spinReelData: <SpinReelRule>{
                updateReelData: [["N1", "N2", "N3", "N4", "H2"], ["H1", "H2", "H3", "H4", "N4"], ["N4", "N3", "N2", "N1", "H3"], ["H4", "H3", "H2", "H1", "N1"], ["N2", "N4", "H2", "H4", "N1"], ["N2", "N4", "H2", "H4", "N4"]],
                multipleInfo: <MultipleInfo>{ pos: [[], [], [], [], [], []], text: [[], [], [], [], [], []] }
            },
            removeSymbolData: [
                //依照RemoveSymbolRule依序執行消除動畫
                // <RemoveSymbolRule>{ score: 2.00, updateReelData: [["H2"], [], ["S3"], [], ["N4"], []], removePos: [[3], [], [4], [], [5], []], multipleInfo: <MultipleInfo>{ pos: [[], [], [1], [], [], []], text: [[], [], ["20x"], [], [], []] } },
            ]
        },
    ];

    // 假設有兩個滾輪，但沒有任何倍數資訊
    // multipleInfo: <MultipleInfo>{ pos: [[], []], text: [[], []] }

    // 假設有兩個滾輪，但第一個滾輪沒有消除資訊
    // { updateReelData: [[], ["N5", "H2", "H3"]], removePos: [[], [2, 4, 5]], multipleInfo: <MultipleInfo>{ pos: [[], []], text: [[], []] } }

    private _NG_curRoutine: SlotFlow = null; //一般遊戲目前例行腳本的流程(第N筆流程)
    private _FG_curRoutine: SlotFlow = null; //免費遊戲目前例行腳本的流程(第N筆流程)
    private _curRemoveSymbolData: RemoveSymbolRule = null;

    private mainIndex = 0; //控制 "_routineScript" 的索引值
    private fgMainIndex = 0;
    private handleRemoveIndex = 0; //控制當前 "removeSymbolData" 的索引值
    private fgHandleRemoveIndex = 0;
    private isFGRoundEnd = false;

    public get GetSpinReelData(): SpinReelRule {
        return this._NG_routineScript[this.mainIndex].spinReelData;
        // return this._NG_curRoutine.spinReelData;
    }

    public get GetFGSpinReelData(): SpinReelRule {
        return this._FG_routineScript[this.fgMainIndex].spinReelData;
    }

    public get hasMultipInfoBeforeRemove(): boolean {
        const multipleInfo = this._NG_routineScript[this.mainIndex].spinReelData.multipleInfo;
        // multipleInfo的pos只要有一個陣列長度大於0，代表需要處理倍數效果
        return multipleInfo.pos.some(ps => ps.length > 0);
    }

    public get hasMultipInfoBeforeFGRemove(): boolean {
        const multipleInfo = this._FG_routineScript[this.fgMainIndex].spinReelData.multipleInfo;
        // multipleInfo的pos只要有一個陣列長度大於0，代表需要處理倍數效果
        return multipleInfo.pos.some(ps => ps.length > 0);
    }

    public get GetFGTotalRound(): number {
        return this._FG_routineScript.length;
    }

    public get GetRestOfFGRound(): number {
        return this._FG_routineScript.length - this.fgMainIndex - 1;
    }

    /* public get GetRemoveMultipleInfo(): MultipleInfo | null {
        // return this._curRemoveSymbolData.multipleInfo;
        return this._NG_curRoutine.removeSymbolData[this.handleRemoveIndex - 1].multipleInfo;
    } */

    /* public get GetCurrentMultipleInfo(): MultipleInfo | null {
        return this._curRemoveSymbolData.multipleInfo;
    } */

    public get GetAllMultipleInfo(): MultipleInfo[] | null[] {
        const multiArray: MultipleInfo[] = [];
        // 將所有MultipleInfo存入陣列中並返回
        // 在消除之前出現過的倍數資訊
        if (this._NG_curRoutine.spinReelData.multipleInfo != null) {
            multiArray.push(this._NG_curRoutine.spinReelData.multipleInfo);
        }
        // 在消除之後出現的倍數資訊
        this._NG_curRoutine.removeSymbolData.forEach(removeSymbolRule => {
            multiArray.push(removeSymbolRule.multipleInfo);
        })

        return multiArray;
    }

    public get GetAllFGMultipleInfo(): MultipleInfo[] | null[] {
        const multiArray: MultipleInfo[] = [];
        // 將所有MultipleInfo存入陣列中並返回
        // 在消除之前出現過的倍數資訊
        if (this._FG_curRoutine.spinReelData.multipleInfo != null) {
            multiArray.push(this._FG_curRoutine.spinReelData.multipleInfo);
        }
        // 在消除之後出現的倍數資訊
        this._FG_curRoutine.removeSymbolData.forEach(removeSymbolRule => {
            multiArray.push(removeSymbolRule.multipleInfo);
        })

        return multiArray;
    }

    // 該方案是從固定腳本中抽取有倍數資訊的滾輪，但是並不會按照1~N個滾輪的順序處理倍數(暫時保留)
    public get GetAllMultipleSymbolInfo(): MultipleSymbolInfo[] {
        let finalList: MultipleSymbolInfo[] = [];
        this.GetAllMultipleInfo.forEach(multipleInfo => {
            let reelbarO;
            let symbolO;
            let txt;
            multipleInfo.pos.forEach((ps, index) => {
                if (ps.length > 0) {
                    reelbarO = index + 1;
                    symbolO = ps[0]; //按照規則一個滾輪只會出現一個倍數
                }
            })
            multipleInfo.text.forEach((tt, index) => {
                if (tt.length > 0) {
                    txt = tt[0];
                }
            })
            let info = <MultipleSymbolInfo>{
                reelBarOrdinal: reelbarO,
                symbolOrdinal: symbolO,
                multiplText: txt,
            }
            finalList.push(info);
        })

        return finalList;
    }

    public get GetBaseReelData(): string[][] {
        return this._baseReelData;
    }

    public hasFG(): boolean {
        return this._NG_curRoutine.fgInfo.hasFG;
    }

    // todo:這邊就應該判斷好有沒有消除資訊 並且返回正確的訊息
    public hasRemoveInfo(): boolean {
        // return this._curRoutine.removeInfo;
        return this._NG_curRoutine.removeSymbolData.length > 0;
    }

    public hasFGRemoveInfo(): boolean {
        return this._FG_curRoutine.removeSymbolData.length > 0;
    }

    public hasMultipleInfo(): boolean {
        const MultipleList: boolean[] = [];
        this.GetAllMultipleInfo.forEach(multipleInfo => {
            // multipleInfo的pos只要有一個陣列長度大於0，代表需要處理倍數效果
            let hasMultiple = multipleInfo.pos.some(ps => ps.length > 0);
            if (hasMultiple) MultipleList.push(hasMultiple);
        })
        // 倍數清單有內容代表需要處理倍數效果
        return MultipleList.length > 0;
    }

    public hasFGMultipleInfo(): boolean {
        const MultipleList: boolean[] = [];
        this.GetAllFGMultipleInfo.forEach(multipleInfo => {
            // multipleInfo的pos只要有一個陣列長度大於0，代表需要處理倍數效果
            let hasMultiple = multipleInfo.pos.some(ps => ps.length > 0);
            if (hasMultiple) MultipleList.push(hasMultiple);
        })
        // 倍數清單有內容代表需要處理倍數效果
        return MultipleList.length > 0;
    }

    /**
    * handleRemoveIndex隨狀態機操作次數遞增，超出資料範圍時不再繼續消去
    */
    public getRemoveUpdateReelData(): RemoveSymbolRule | null {
        if (this._NG_curRoutine.removeSymbolData[this.handleRemoveIndex] != undefined) {
            const RemoveSymbolResult = this._NG_curRoutine.removeSymbolData[this.handleRemoveIndex];
            // this._curRemoveSymbolData = RemoveSymbolResult;
            this.handleRemoveIndex++;
            return RemoveSymbolResult;
        } else {
            this.handleRemoveIndex = 0;
            // this._curRemoveSymbolData = null;
            return null;
        }
    }

    /**
    * handleRemoveIndex隨狀態機操作次數遞增，超出資料範圍時不再繼續消去
    */
    public getFGRemoveUpdateReelData(): RemoveSymbolRule | null {
        if (this._FG_curRoutine.removeSymbolData[this.fgHandleRemoveIndex] != undefined) {
            const RemoveSymbolResult = this._FG_curRoutine.removeSymbolData[this.fgHandleRemoveIndex];
            this.fgHandleRemoveIndex++;
            return RemoveSymbolResult;
        } else {
            this.fgHandleRemoveIndex = 0;
            return null;
        }
    }

    public getFGSymbolScore(): number {
        return this._NG_curRoutine.fgInfo.score;
    }

    public isNextRemove(): boolean {
        if (this._NG_curRoutine.removeSymbolData[this.handleRemoveIndex] != undefined) return true;
        else return false;
    }

    public isNextFGRemove(): boolean {
        if (this._FG_curRoutine.removeSymbolData[this.fgHandleRemoveIndex] != undefined) return true;
        else return false;
    }

    public isFGRoundComplete(): boolean {
        return this.isFGRoundEnd;
    }

    // todo: 將固定盤面以及新產生的滾輪訊息寫在該腳本 以及消除那些圖標 消除後產生那些圖標
    public initReels() {

    }

    /* public startSpin(): number[][] {
        console.log("start spin 提供下一次轉動時的圖標資訊");
        return this.reels;
    } */

    /**
     * 注意：此函式每次呼叫時索引值會遞增，到達上限後從零開始，每次都取得下一筆資料
     * @returns 最新的盤面結果
     */
    public getSpinUpdateReelData(): Promise<string[][]> {
        return new Promise((resovle, reject) => {
            // 模擬向後端取得盤面資料(WebSocket的作法:在這發送封包給後端，等待onMessage收到資料後再回呼SPIN_IN)
            setTimeout(() => {
                const SpinReelData = this.GetSpinReelData;
                this._NG_curRoutine = this._NG_routineScript[this.mainIndex];
                this.mainIndex++;
                // this.isFGRoundEnd = false;
                // 超過例行腳本範圍，再從頭開始取值，並重置相關索引值
                if (this.mainIndex == this._NG_routineScript.length) {
                    // this.mainIndex = 0;
                    // this.handleRemoveIndex = 0;
                    // this._NG_curRoutine = this._NG_routineScript[this.mainIndex];
                }
                // if (this.mainIndex == this._NG_routineScript.length - 1) this.mainIndex = 0;
                // else this.mainIndex++;
                resovle(SpinReelData.updateReelData);
                if (SpinReelData == undefined) reject(err => { console.error(err) });
            }, 0);
        })
    }

    public resetNG() {
        if (this.mainIndex == this._NG_routineScript.length) {
            this.mainIndex = 0;
            this.handleRemoveIndex = 0;
        }
    }

    /**
     * 注意：此函式每次呼叫時索引值會遞增，到達上限後從零開始，每次都取得下一筆資料
     * @returns 最新的盤面結果
     */
    public getFGSpinUpdateReelData(): Promise<string[][]> {
        return new Promise((resovle, reject) => {
            // 模擬向後端取得盤面資料(WebSocket的作法:在這發送封包給後端，等待onMessage收到資料後再回呼SPIN_IN)
            setTimeout(() => {
                const SpinReelData = this.GetFGSpinReelData;
                this._FG_curRoutine = this._FG_routineScript[this.fgMainIndex];
                this.fgMainIndex++;
                // 超過例行腳本範圍，再從頭開始取值，並重置相關索引值
                if (this.fgMainIndex == this._FG_routineScript.length) {
                    // this.fgMainIndex = 0;
                    // this.fgHandleRemoveIndex = 0;
                    // this._FG_curRoutine = this._FG_routineScript[this.fgMainIndex];
                    this.isFGRoundEnd = true;
                }
                resovle(SpinReelData.updateReelData);
                if (SpinReelData == undefined) reject(err => { console.error(err) });
            }, 0);
        })
    }

    // todo: FGComplete時呼叫
    public resetFG() {
        if (this.fgMainIndex == this._FG_routineScript.length) {
            this.isFGRoundEnd = false;
            this.fgMainIndex = 0;
            this.fgHandleRemoveIndex = 0;
        }
    }
}