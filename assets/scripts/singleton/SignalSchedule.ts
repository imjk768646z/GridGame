import { Signal } from '../component/Signal';
import { SignalManager } from './SignalManager';

/**
 * 動畫事件排程(參數)
 * data 值為字串、函值為any
 */
export type SignalScheduleParam = Array<Array<any>>;

/**
 * 動畫事件排程
 */
export class SignalSchedule {
    private keys: any = null;
    // 排程
    private data: Array<Array<string>>;
    // 執行序號
    private index: number = 0;
    // 執行次數
    private count: number = 0;
    // 排程結束回調
    private overFunc: Function = null;

    private runData: Array<EventType> = new Array<EventType>();

    private isLog: boolean;

    private static instance: SignalSchedule;
    public static get Instance() {
        if (SignalSchedule.instance == undefined) {
            SignalSchedule.instance = new SignalSchedule();
        }

        return SignalSchedule.instance;
    }

    // 設定排程
    SetSchedule(value: Array<Array<any>>) {
        this.data = value;
        this.runData = [];
        this.index = 0;
        return this;
    }

    // 清除排程
    ClearSchedule() {
        this.index = 0;
        this.count = 0;
        this.data = [];
        this.runData = [];
    }

    // 執行內容
    Show() {
        if (this.data == undefined || this.data == null) {
            // 結束排程管理
            this.overSchedule();
            return;
        }
        const len = this.data.length;
        if (len == 0 || this.index >= len) {
            // 結束排程管理
            this.overSchedule();
            return;
        }

        const ary = this.data[this.index];
        this.count = ary.length;
        let keyAry = [];
        ary.forEach((value) => {
            // 發送此階段的排程動畫行為,等待各自行為觸發完畢callback,才進入下一個階段
            if (this.keys != null) {
                let key = this.keys[value];
                SignalManager.dispathEvent(new Signal(key));
                this.runData.push(<EventType>{ Name: key, isCallBack: false });
                keyAry.push(key);
            } else {
                SignalManager.dispathEvent(new Signal(value));
                this.runData.push(<EventType>{ Name: value, isCallBack: false });
                keyAry.push(value);
            }
        });

        if (this.isLog)
            (this.count > 1) ? console.log("併發排程事件:", keyAry, "等待回調") : console.log("順序排程事件:", keyAry, "等待回調");
    }

    // 排程內容調用(外部不用呼叫)
    Complete(eventName: string) {
        let isOk: boolean;
        this.runData.forEach((item: EventType) => {
            if (item.Name == eventName && !item.isCallBack) {
                item.isCallBack = true;
                isOk = true;
            }
        })

        if (!isOk) { return; }

        if (this.isLog)
            console.log("CBS:", eventName)

        // 每次事件完成 count -1 (備註每一個動畫完成的時間不同)
        this.count--;
        if (this.count !== 0) {
            return;
        }
        // 此階段所有的動畫都通知完成,進入下一個階段
        this.index++;
        if (this.index < this.data.length) {
            this.Show();
            return;
        }
        // 結束排程觸發回調
        this.overSchedule();
    }

    // 回調排程已完成
    overSchedule() {
        this.index = 0;
        if (this.overFunc != null) {
            this.overFunc();
        }
    }

    // 註冊排程完成的callBack func
    static set addScheduleComplete(callback: Function) {
        this.Instance.overFunc = callback;
    }

    static set IsOpenLog(value: boolean) {
        this.Instance.isLog = value;
    }

    static set SetKeys(Data: any) {
        this.Instance.keys = Data;
    }
}

type EventType = {
    Name: string
    isCallBack: boolean
}