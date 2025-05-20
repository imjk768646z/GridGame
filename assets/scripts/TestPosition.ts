import { _decorator, Component, Node, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TestPosition')
export class TestPosition extends Component {

    @property(Node)
    private innerNode: Node = null;

    start() {
        // let localPos = this.innerNode.position;
        // console.log("! TestPositionIn 本地位置:", localPos);
        const worldPos = this.innerNode.worldPosition; //取得該節點的世界座標
        // console.log("! TestPositionIn 世界位置:", worldPos);

        // let canvasPos = this.innerNode.inverseTransformPoint(worldPos, this.node.position);
        // console.log("! TestPositionIn 在Canvas的位置:", canvasPos);

        // const WPos = new Vec3();
        // let transform = this.innerNode.getComponent(UITransform).convertToWorldSpaceAR(Vec3.ZERO, WPos);
        // console.log("! TestPositionIn 轉換後的位置:", WPos);

        const targetPos = new Vec3(); //先宣告一個變數 等待呼叫convertToNodeSpaceAR以便更新
        const canvasSys = this.node.parent.getComponent(UITransform); //取得目標節點的UITransform組件
        canvasSys.convertToNodeSpaceAR(worldPos, targetPos); //將主要節點轉換成目標節點的本地座標
        console.log("!!! TestPositionIn 在Canvas的位置:", targetPos);

        const outter = new Packet("Dog");
        this.testOut("change", outter);
        console.log("! testOut:", outter);
    }

    testOut(inner: string, out: Packet) {
        switch (inner) {
            case "change":
                out._name = "Cat";
                break;
            default:
                break;
        }
        return out;
    }

    update(deltaTime: number) {

    }
}

class Packet {
    _name: string = "";
    constructor(name) {
        this._name = name;
    }
}