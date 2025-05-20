// import { Tool } from '../../../components/Utility/Tool';
import { _decorator, Component, Label, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass
export class RunScore extends Component {
    /** 是否快速停止 */
    private isimmediatelyEnd = false;
    /** 階段 */
    private stepData: number[] = [];
    /** 階段index */
    private stepInx = 0;
    /** 階段fun */
    private stepEventFun: Function = null;
    /** 階段Offon */
    private easeBool = false;
    /** 階段time ease*/
    private durationTime = 0;
    private onComplete: Function = null;
    private onUpdate: Function = null;

    private onWrite: Function = null;
    // 字體
    //private  font = font;
    // 文字物件
    private item: Label = null;
    // 數值
    private sNowShowNum = 0;
    // 幣別
    private currencySign = '';
    // use Denom
    private DenomDefine = 0;
    // 是否要小數點
    private isShowDecimal = false;
    // 小數點是否固定顯示欄位
    private isDecimalFix = false;
    // 是否要千分位
    private isShowComma = false;

    /**
     * 動畫總時間(跑表完會再多加兩秒停留)
     */
    private numberTime = 6;
    /**
     * 倒扣值
     */
    private substration = 1;
    private tmpTime: number = -1;
    private timeScore: Score;
    private places: number = 0;
    private initScaleX: number = 1;
    private initScaleY: number = 1;

    init() {
        // console.log("Run Score Start");
        this.item = this.node.getComponent(Label);
        this.initScaleX = this.node.getScale().x;
        this.initScaleY = this.node.getScale().y;
    }

    set setUpdateFunc(func: Function) {
        this.onUpdate = func;
    }

    /**
     * [設定是否小數點]
     * @param  {[Boolean]}  value [description]
     */
    set isDecimal(value: boolean) {
        this.isShowDecimal = value;
    }

    set setWritePack(func: Function) {
        this.onWrite = func;
    }

    /**
     * [小數點固定]
     * @param {Boolean}  value [description]
     */
    set isDecimalFixed(value: boolean) {
        this.isDecimalFix = value;
    }

    /**
     * [設定是否顯示千分位]
     * @param  {[Boolean]}  value [description]
     */
    set isComma(value: boolean) {
        this.isShowComma = value;
    }

    /**
     * [設定幣值轉換]
     * @param {number}  number [description]
     */
    set setDenomDef(value: number) {
        this.DenomDefine = value;
    }

    set setPlaces(value: number) {
        this.places = value;
    }

    private callDenodefValue(num) {
        let point = num;
        if (this.places > 0) {
            // point = Tool.toDecimal(this.sNowShowNum, this.places);
            point = parseFloat(num.toFixed(this.places));
        }
        return point;
    }

    set setCurrencySign(value) {
        this.currencySign = value;
    }

    /**
     * 顯示數字(靜態)
     * @param  {string}      sNumber  數字
     * @param  {Boolean}     bool     是否經過DenomDefine運算
    */
    showNum(sNumber, bool = true) {
        this.sNowShowNum = sNumber;
        const strnum = (bool) ? this.callDenodefValue(this.sNowShowNum) : this.sNowShowNum;
        this.writeShowNumber(strnum);
    }

    // ------- 跑分 ---------
    // 顯示數字 (跑分功能)
    runScoreTime(duration: number, endNum: number, startNum: number = 0, callBack: Function = null, writeBack: Function = null) {
        this.timeScore = <Score>{
            // 起始值
            startNum: startNum,
            // 結束值
            endNum: endNum
        };
        this.clearNumber();

        let addScore = endNum - startNum;
        this.substration = (this.isShowDecimal) ? addScore / duration : Math.round(addScore / duration);
        // this.substration = Math.round(addScore / duration);
        // 起始值
        this.runNum(this.timeScore.startNum);
        this.numberTime = duration;
        this.onComplete = callBack;
        this.onWrite = writeBack;
        this.tmpTime = 0;
    }

    update(dt) {
        if (this.tmpTime != -1) {
            this.tmpTime += dt;
            if (!this.isimmediatelyEnd && this.numberTime > this.tmpTime && this.sNowShowNum < this.timeScore.endNum) {
                // let amount = Math.round(this.timeScore.startNum + (this.tmpTime * this.substration));
                let amount = this.timeScore.startNum + (this.tmpTime * this.substration);
                this.runNum(amount);
            }
            else {
                this.runNum(this.timeScore.endNum, true);
                this.tmpTime = -1;
            }
        }
    }

    /**
     * 快速停止(用於跑分)
     */
    immediatelyRunEnd() {
        this.isimmediatelyEnd = true;
    }

    // ------- 階段功能 ----------
    /**
     * set 階段
     * @param {Array<number>}   data        設定分數變大
     * @param {Boolean}         easeBool    是否以緩動方式變大
     * @param {number}          duration    當緩動開啟 此參數為緩動時間
     */
    setStepData(data, easeBool = false, duration = 0.2) {
        this.stepData = data;
        this.easeBool = easeBool;
        this.durationTime = duration;
    }

    /**
     * 階段性callback
     * @param {Function} fn [設定callBack]
     */
    set setStepFun(func: Function) {
        this.stepEventFun = func;
    }

    /**
     * 階段判斷
     * @param {number} num  數字
     */
    stepEvent(num) {
        if (num >= this.stepData[this.stepInx]) {
            this.stepInx++;
            (this.easeBool) ? this.easeingAnScale() : this.setAnScale();
        }
    }

    /** 直接階段變大 */
    setAnScale() {
        // this.item.fontSize = this.fontSize + 4;
        this.node.setScale(this.node.getScale().x += 0.2, this.node.getScale().y += 0.2, this.node.getScale().z);
        // 回調階段事件
        this.onCallBackstep();
    }

    /** 緩衝階段變大 */
    easeingAnScale() {
        // this.node.runAction(cc.scaleTo(this.durationTime + 0.1, this.node.scaleX + 0.2, this.node.scaleY + 0.2));
        this.onCallBackstep();
    }

    /**
     * [發布階段性事件]
     */
    onCallBackstep() {
        if (this.stepEventFun !== null) {
            this.stepEventFun(this.stepInx);
        }
    }

    /**
    * 數字顯示 (用於跑分有階段版)
    * @param {string}   sShowNumber      顯示的數字
    * @param {Boolean}  completeDispath  是否跑分完畢的最後結果
    */
    runNum(sShowNumber: number, completeDispath = false) {
        this.sNowShowNum = sShowNumber;
        // 階段
        if (this.stepData.length > 0 && this.stepInx < this.stepData.length) {
            this.stepEvent(Number(sShowNumber));
        }
        const strnum = this.callDenodefValue(sShowNumber);
        this.writeShowNumber(strnum);

        if (completeDispath) {
            if (this.onComplete != null) {
                this.onComplete();
            }
        }
    }

    // 寫入顯示數值
    writeShowNumber(num) {
        if (this.onUpdate != null) {
            this.onUpdate(this.sNowShowNum.toString);
        }
        if (this.item !== null) {
            this.item.string = `${this.currencySign}${num}`;
        }
        if (this.onWrite) {
            this.onWrite(this.node, this.currencySign, num, this.sNowShowNum);
        }
    }

    /**
     * @param {Boolean} clearBool 是否清除文字
     */
    clearNumber(clearBool: boolean = false) {
        this.showNum(this.timeScore.endNum);
        this.isimmediatelyEnd = false;
        this.stepInx = 0;
        if (clearBool) {
            this.item.string = '';
        }

        // this.item.fontSize = this.fontSize;
        this.node.setScale(this.initScaleX, this.initScaleY, this.node.getScale().z);
    }

    readScore() {
        if (!this.isimmediatelyEnd) {
            this.writeShowNumber(this.callDenodefValue(this.sNowShowNum));
        }
    }

    /**
    * 取小數點
    * @param {any} num 數字
    * @param {number} count 第幾位
    * @return {string} str2 '1500'
    */
    caculateDecimal(num, count = 2) {
        const str = `${num}`;
        let icount = count;
        let str2 = '';
        let isPoint = false;
        for (let i = 0; i < str.length; i++) {
            if (icount > 0) {
                str2 += str.charAt(i);
                if (str.charAt(i - 1) === '.') {
                    isPoint = true;
                }
                if (isPoint === true) {
                    icount--;
                }
            }
        }

        if (this.isDecimalFix) {
            if (!isPoint && icount > 0) {
                str2 = `${str2}.`;
            }
            for (let i = 0; i < icount; i++) {
                str2 = `${str2}0`;
            }
        }
        return str2;
    }
}

type Score = {
    // 起始值
    startNum: number
    // 結束值
    endNum: number
}