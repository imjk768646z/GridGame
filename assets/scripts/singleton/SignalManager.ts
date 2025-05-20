import { SignalType } from '../Definition';
import { Signal, ISignal } from '../component/Signal';

export function AddSignal(signalName: SignalType, callback: (event?: ISignal) => {}) {
    SignalManager.addEventListener(SignalType[signalName], callback);
}

export class SignalManager {
    private signalMap: Map<string, Array<Function>> = new Map<string, Array<Function>>();
    private static instance: SignalManager;
    private static get Instance() {
        if (SignalManager.instance == undefined) {
            SignalManager.instance = new SignalManager();
        }

        return SignalManager.instance;
    }

    public static dispathEvent(signal: ISignal) {
        let timer = setTimeout(() => {
            this.Instance.dispatch(signal.EventName, signal);
            clearTimeout(timer)
            timer = null;
        }, 0);
    }

    public static addEventListener(signalKey: string, callback: Function) {
        if (this.Instance.signalMap[signalKey] != callback) {
            if (this.Instance.signalMap[signalKey] == null) {
                this.Instance.signalMap[signalKey] = new Array<Function>();
            }
            this.Instance.signalMap[signalKey].push(callback);
        }
    }

    private dispatch(key: string, event: ISignal) {
        if (this.signalMap != null && this.signalMap[key] != null) {
            const eventFuncs = this.signalMap[key];
            for (let i = 0; i < eventFuncs.length; i++) {
                const fn = eventFuncs[i];
                if (fn != null) {
                    fn(event);
                }
            }
        }
    }

    public static ClearEvent() {
        this.Instance.signalMap = new Map<string, Array<Function>>();
    }

    public static CallBack(signalName: string) {
        Signal.signalCallBack(signalName);
    }
}
