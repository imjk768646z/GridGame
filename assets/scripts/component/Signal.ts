import { SignalSchedule } from '../singleton/SignalSchedule';

export class Signal implements ISignal {
    private signalName: string = "";
    private data: any = null;

    constructor(event: string, data?: any) {
        this.signalName = event;
        this.data = data;
    }

    get EventName() {
        return this.signalName;
    }

    get Data() {
        return this.data;
    }

    CallBack() {
        // 動畫事件通知完成
        SignalSchedule.Instance.Complete(this.signalName);
    }

    static signalCallBack(name: string) {
        SignalSchedule.Instance.Complete(name);
    }
}


export interface ISignal {
    CallBack()
    EventName: string
    Data: any
}