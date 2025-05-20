import { _decorator, Component, Label, Node, ProgressBar } from 'cc';
import { ISignal } from './component/Signal';
import { AddSignal } from './singleton/SignalManager';
import { SignalType } from './Definition';
const { ccclass, property } = _decorator;

@ccclass('LoadScene')
export class LoadScene extends Component {

    @property(Label)
    private loadingMsg: Label = null;

    private progressBar: ProgressBar = null;

    onLoad() {
        this.progressBar = this.node.getComponent(ProgressBar);
        // AddSignal(SignalType.Loading, this.onLoading.bind(this));
        // AddSignal(SignalType.LoadingSetting, this.onLoadingSetting.bind(this));
    }

    start() {

    }

    private onLoading(event: ISignal) {
        console.log("onLoading");
        event.CallBack();
    }

    private onLoadingSetting(event: ISignal) {
        console.log("onLoadingSetting");
        event.CallBack();
    }

    public updateLoadingBar(progress: number, msg: string) {
        this.progressBar.progress = progress;
        this.loadingMsg.string = msg;
    }

    public hide() {
        this.node.active = false;
    }

    update(deltaTime: number) {

    }
}


