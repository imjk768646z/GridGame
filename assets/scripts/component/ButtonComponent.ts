import { _decorator, Button, Component, Node } from 'cc';
import { IButtonHandler } from '../game/interface/IButtonHandler';
import { GameState } from '../game/state/GameState';
const { ccclass, property } = _decorator;

// 按鈕列表
export enum ButtonList {
    btn_spin,
    btn_stop,
    btn_auto_stop,
    btn_auto_on,
    btn_auto_off,
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
    private isAutoMode: boolean = false;

    init(handler: IButtonHandler) {
        this.handler = handler;
        for (let item in ButtonList) {
            if (isNaN(Number(item))) {
                // 讀取Button列表 加入Button Event
                const button = this.node.getChildByName(item).getChildByName("Button");
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
                    // btn.transition = Button.Transition.SCALE;
                    this.buttonMap[item] = btn;
                }
            }
        }
    }

    start() {

    }

    updateAutoMode(value: boolean) {
        this.isAutoMode = value;
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
            case ButtonList.btn_auto_on:
                console.log("開啟自動模式");
                this.handler.onAutoOn();
                break;
            case ButtonList.btn_auto_stop:
            case ButtonList.btn_auto_off:
                this.setBtnInteractable(ButtonList.btn_auto_stop, false);
                this.setBtnInteractable(ButtonList.btn_auto_off, false);
                this.handler.onAutoOff();
                break;
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

    // 設定按鈕禁用
    setBtnInteractable(btn: ButtonList, value: boolean) {
        const button = this.buttonMap[ButtonList[btn]];
        if (button != null) {
            button.interactable = value;
        }
    }

    // 設定按鈕是否顯示
    setBtnVisible(btn: ButtonList, value: boolean) {
        const button = this.buttonMap[ButtonList[btn]];
        if (button != null) {
            let btn: Node = button.node;
            btn.parent.active = value;
            btn.active = value;
        }
    }

    public updateButtonState(state: GameState) {
        switch (state) {
            case GameState.Wait:
                this.setBtnInteractable(ButtonList.btn_auto_stop, true);
                this.setBtnInteractable(ButtonList.btn_auto_on, true);
                if (this.isAutoMode) {
                    this.setBtnVisible(ButtonList.btn_spin, false);
                    this.setBtnVisible(ButtonList.btn_stop, false);
                    this.setBtnVisible(ButtonList.btn_auto_on, false);
                    this.setBtnVisible(ButtonList.btn_auto_off, true);
                    this.setBtnVisible(ButtonList.btn_auto_stop, true);
                    this.setBtnInteractable(ButtonList.btn_raise, false);
                    this.setBtnInteractable(ButtonList.btn_reduce, false);
                } else {
                    this.setBtnVisible(ButtonList.btn_spin, true);
                    this.setBtnVisible(ButtonList.btn_stop, false);
                    this.setBtnVisible(ButtonList.btn_auto_on, true);
                    this.setBtnVisible(ButtonList.btn_auto_off, false);
                    this.setBtnVisible(ButtonList.btn_auto_stop, false);
                    this.setBtnInteractable(ButtonList.btn_raise, true);
                    this.setBtnInteractable(ButtonList.btn_reduce, true);
                }
                break;
            case GameState.NGSpin:
                if (this.isAutoMode) {
                    this.setBtnVisible(ButtonList.btn_spin, false);
                    this.setBtnVisible(ButtonList.btn_stop, false);
                    this.setBtnVisible(ButtonList.btn_auto_on, false);
                    this.setBtnVisible(ButtonList.btn_auto_off, true);
                    this.setBtnVisible(ButtonList.btn_auto_stop, true);
                    this.setBtnInteractable(ButtonList.btn_raise, false);
                    this.setBtnInteractable(ButtonList.btn_reduce, false);
                    this.setBtnInteractable(ButtonList.btn_auto_stop, false);
                } else {
                    this.setBtnVisible(ButtonList.btn_spin, false);
                    this.setBtnVisible(ButtonList.btn_stop, true);
                    this.setBtnInteractable(ButtonList.btn_stop, false);
                    this.setBtnInteractable(ButtonList.btn_raise, false);
                    this.setBtnInteractable(ButtonList.btn_reduce, false);
                    this.setBtnInteractable(ButtonList.btn_auto_on, false);
                }
                break;
            case GameState.FGSpin:
                if (this.isAutoMode) {
                    this.setBtnVisible(ButtonList.btn_spin, false);
                    this.setBtnVisible(ButtonList.btn_stop, false);
                    this.setBtnVisible(ButtonList.btn_auto_on, false);
                    this.setBtnVisible(ButtonList.btn_auto_off, true);
                    this.setBtnVisible(ButtonList.btn_auto_stop, true);
                    this.setBtnInteractable(ButtonList.btn_raise, false);
                    this.setBtnInteractable(ButtonList.btn_reduce, false);
                    this.setBtnInteractable(ButtonList.btn_auto_stop, false);
                } else {
                    this.setBtnVisible(ButtonList.btn_spin, false);
                    this.setBtnVisible(ButtonList.btn_stop, true);
                    this.setBtnVisible(ButtonList.btn_auto_on, true);
                    this.setBtnVisible(ButtonList.btn_auto_off, false);
                    this.setBtnInteractable(ButtonList.btn_stop, false);
                    this.setBtnInteractable(ButtonList.btn_raise, false);
                    this.setBtnInteractable(ButtonList.btn_reduce, false);
                    this.setBtnInteractable(ButtonList.btn_auto_on, false);
                    this.setBtnInteractable(ButtonList.btn_auto_stop, false);
                }
                break;
            case GameState.FeaturePlay:
            case GameState.FGFeaturePlay:
                if (this.isAutoMode) {
                    this.setBtnVisible(ButtonList.btn_spin, false);
                    this.setBtnVisible(ButtonList.btn_stop, false);
                    this.setBtnVisible(ButtonList.btn_auto_on, false);
                    this.setBtnVisible(ButtonList.btn_auto_off, true);
                    this.setBtnVisible(ButtonList.btn_auto_stop, true);
                    this.setBtnInteractable(ButtonList.btn_raise, false);
                    this.setBtnInteractable(ButtonList.btn_reduce, false);
                    this.setBtnInteractable(ButtonList.btn_auto_stop, true);
                    this.setBtnInteractable(ButtonList.btn_auto_off, true);
                } else {
                    this.setBtnInteractable(ButtonList.btn_stop, true);
                }
                break;
            default:
                break;
        }
    }

    update(deltaTime: number) {

    }

    //onClick 全部由GameScene執行按鈕事件 
}


