import { _decorator, Color, Component, Graphics, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameRule')
export class GameRule extends Component {

    @property(Node)
    private close: Node = null;

    onLoad() {
        this.drawCloseButton(new Color("#844200"));
        this.close.on(Node.EventType.TOUCH_START, this.onClose, this);
        this.close.on(Node.EventType.MOUSE_ENTER, this.onCloseEnter, this);
        this.close.on(Node.EventType.MOUSE_LEAVE, this.onCloseLeave, this);
    }

    start() {
        // this.node.active = false;
    }

    private onClose() {
        this.node.active = false;
    }

    private onCloseEnter() {
        this.drawCloseButton(new Color("#642100"));
    }

    private onCloseLeave() {
        this.drawCloseButton(new Color("#844200"));
    }

    private drawCloseButton(color: Color) {
        const graphics = this.close.getComponent(Graphics);
        const length = this.close.getComponent(UITransform).contentSize.width / 2;
        graphics.clear();
        graphics.moveTo(-(length), length);
        graphics.lineTo(length, -(length));
        graphics.moveTo(length, length);
        graphics.lineTo(-(length), -(length));
        graphics.lineWidth = 5;
        graphics.strokeColor = color;
        graphics.stroke();
    }

    update(deltaTime: number) {

    }
}


