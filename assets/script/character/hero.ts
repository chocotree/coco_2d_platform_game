const { ccclass, property } = cc._decorator;

const input = {};

const enum State {
    stand = 1,
    attack = 2,
}

const enum Animation {
    idle = 1,
}

@ccclass
export default class NewClass extends cc.Component {

    private heroState = State.stand;
    private animationType = Animation.idle;
    private moveSpeed = 200;
    private sp = cc.v2(0, 0);
    private lv: cc.Vec2;

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.handleKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.handleKeyUp, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.handleKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.handleKeyUp, this);
    }

    handleKeyUp(e) {
        input[e.keyCode] = false;
    }

    handleKeyDown(e) {
        input[e.keyCode] = true;
    }

    update(dt) {
        const heroRigidBody = this.node.getComponent(cc.RigidBody);
        const scaleX = Math.abs(this.node.scaleX);
        let isMoving = false;

        this.lv = heroRigidBody.linearVelocity;

        // move left
        if (input[cc.macro.KEY.a] || input[cc.macro.KEY.left]) {
            this.node.scaleX = -scaleX;
            this.sp.x = -1;
            isMoving = true;
        }

        // move right
        if (input[cc.macro.KEY.d] || input[cc.macro.KEY.right]) {
            this.node.scaleX = scaleX;
            this.sp.x = 1;
            isMoving = true;
        }

        if (isMoving) {
            this.lv.x = this.sp.x * this.moveSpeed;
        } else {
            this.lv.x = 0;
        }

        heroRigidBody.linearVelocity = this.lv;
    }
}
