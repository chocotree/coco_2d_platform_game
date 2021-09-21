const { ccclass, property } = cc._decorator;

const input = {};

const enum State {
    stand = 1,
    attack = 2,
}

const enum Animation {
    idle = 'idle',
    run = 'run',
}

@ccclass
export default class NewClass extends cc.Component {

    private heroState = State.stand;
    private currentAnim = Animation.idle;
    private moveSpeed = 200;
    private speedDirection = cc.v2(0, 0);
    private characterLv: cc.Vec2;
    private heroAnim: cc.Animation;
    private heroRigidBody: cc.RigidBody;

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);

        this.heroAnim = this.node.getComponent(cc.Animation);
        this.heroRigidBody = this.node.getComponent(cc.RigidBody);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    onKeyUp(e) {
        input[e.keyCode] = false;
    }

    onKeyDown(e) {
        input[e.keyCode] = true;
    }

    setHeroAnim(animName: Animation) {
        if (this.currentAnim == animName) return;

        this.currentAnim = animName;
        this.heroAnim.play(animName);
    }

    changeCharacterDirection(direction: "left" | "right") {
        const scaleX = Math.abs(this.node.scaleX);
        if (direction === 'left') this.node.scaleX = -scaleX;
        if (direction === 'right') this.node.scaleX = scaleX;
    }

    handleKeyPress() {
        let anim = Animation.idle;

        // move left
        if (input[cc.macro.KEY.a] || input[cc.macro.KEY.left]) {
            this.changeCharacterDirection('left');
            this.speedDirection.x = -1;
            anim = Animation.run;
        }

        // move right
        if (input[cc.macro.KEY.d] || input[cc.macro.KEY.right]) {
            this.changeCharacterDirection('right');
            this.speedDirection.x = 1;
            anim = Animation.run;
        }

        this.setHeroAnim(anim)
    }

    updateCharacterVelocity() {
        this.characterLv = this.heroRigidBody.linearVelocity;

        if (this.currentAnim === Animation.run) {
            this.characterLv.x = this.speedDirection.x * this.moveSpeed;
        } else {
            this.characterLv.x = 0;
        }

        this.heroRigidBody.linearVelocity = this.characterLv;
    }

    update(dt) {
        this.handleKeyPress();
        this.updateCharacterVelocity();
    }
}
