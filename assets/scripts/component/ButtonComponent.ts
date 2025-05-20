import { _decorator, Button, Component, Node } from 'cc';
import { IButtonHandler } from '../game/interface/IButtonHandler';
const { ccclass, property } = _decorator;

// 按鈕列表
export enum ButtonList {
    btn_spin,
    btn_stop,
    // btn_autostop,
    // btn_fast_on,
    // btn_fast_off,
    btn_raise,
    btn_reduce,
    // btn_info,
};

@ccclass('ButtonComponent')
export class ButtonComponent extends Component {

    private buttonMap: Map<string, Button> = new Map<string, Button>();
    private component: string = "ButtonComponent";
    private func: string = "onButtonClick";
    private handler: IButtonHandler = null;

    init(handler: IButtonHandler) {
        this.handler = handler;
        for (let item in ButtonList) {
            if (isNaN(Number(item))) {
                // 讀取Button列表 加入Button Event
                const button = this.node.getChildByName(item);
                if (button != null) {
                    const clickEventHandler = new Component.EventHandler();
                    clickEventHandler.target = this.node;
                    clickEventHandler.component = this.component;
                    clickEventHandler.handler = this.func;
                    clickEventHandler.customEventData = ButtonList[item];

                    let btn = button.getComponent(Button);
                    if (btn == null) {
                        // 防呆 補充cc.Button
                        btn = button.addComponent(Button);
                    }
                    btn.clickEvents.push(clickEventHandler);
                    // btn.enableAutoGrayEffect = true; //todo: 研究如何在取消點擊功能是反灰
                    // btn.transition = Button.Transition.SCALE;
                    this.buttonMap[item] = btn;
                }
            }
        }
    }

    start() {

    }

    onButtonClick(event: any, customEventData?: any) {
        switch (customEventData) {
            case ButtonList.btn_spin:
                console.log("按下轉動");
                this.handler.onSpin();
                break;
            case ButtonList.btn_stop:
                console.log("按下停止");
                this.handler.onStop();
                break;
            // case ButtonList.btn_fast_on:
            //     break;
            // case ButtonList.btn_autostop:
            // case ButtonList.btn_fast_off:
            //     break;
            case ButtonList.btn_raise:
                this.handler.onRaise();
                break;
            case ButtonList.btn_reduce:
                this.handler.onReduce();
                break;
            // case ButtonList.btn_info:
            //     break;
            default:
        }
    }

    update(deltaTime: number) {

    }

    //onClick 全部由GameScene執行按鈕事件 
}


