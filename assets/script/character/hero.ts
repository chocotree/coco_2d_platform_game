const { ccclass, property } = cc._decorator;

const input = {};

const enum State {
    STAND = 1,
    ATTACK = 2,
}

const enum Animation {
    Idle = 'idle',
    RUN = 'run',
    COMBO1 = 'attack1',
    COMBO2 = 'attack2',
    COMBO3 = 'attack3',
}

@ccclass
export default class NewClass extends cc.Component {
    /** character state machines */
    private heroState = State.STAND;
    /** which animation is been playing now */
    private currentAnim = Animation.Idle;
    /** character movenment speed */
    private moveSpeed = 200;
    /** character movenment direction */
    private speedDirection = cc.v2(0, 0);
    /** character linear velocity */
    private characterLv: cc.Vec2;
    /** character animation component */
    private heroAnim: cc.Animation;
    /** character rigid body component */
    private heroRigidBody: cc.RigidBody;
    /** attack combos */
    private animComboCount = 0;

    onLoad() {
        this.heroRigidBody = this.node.getComponent(cc.RigidBody);
        this.heroAnim = this.node.getComponent(cc.Animation);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.heroAnim.on(cc.Animation.EventType.FINISHED, this.onAnimFinished, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        this.heroAnim.off(cc.Animation.EventType.FINISHED, this.onAnimFinished, this);
    }

    onKeyUp(e) {
        input[e.keyCode] = false;
    }

    onKeyDown(e) {
        input[e.keyCode] = true;
    }

    onAnimFinished(e, animState: cc.AnimationState) {
        if (
            animState.name === Animation.COMBO1 ||
            animState.name === Animation.COMBO2 ||
            animState.name === Animation.COMBO3
        ) {
            this.heroState = State.STAND;
            this.animComboCount = (this.animComboCount + 1) % 3;
        }
    }

    setHeroAnim(animName: Animation) {
        if (this.currentAnim == animName) return;

        this.currentAnim = animName;
        this.heroAnim.play(animName);
    }

    changeCharacterDirection(direction: 'left' | 'right') {
        const scaleX = Math.abs(this.node.scaleX);
        if (direction === 'left') this.node.scaleX = -scaleX;
        if (direction === 'right') this.node.scaleX = scaleX;
    }

    characterMove() {
        let anim = Animation.Idle;
        this.animComboCount = 0;

        // move left
        if (input[cc.macro.KEY.a] || input[cc.macro.KEY.left]) {
            this.changeCharacterDirection('left');
            this.speedDirection.x = -1;
            anim = Animation.RUN;
        }

        // move right
        if (input[cc.macro.KEY.d] || input[cc.macro.KEY.right]) {
            this.changeCharacterDirection('right');
            this.speedDirection.x = 1;
            anim = Animation.RUN;
        }

        this.setHeroAnim(anim);
    }

    characterAttack() {
        const isNormalComboAttack = input[cc.macro.KEY.c] || input[cc.macro.KEY.j];
        if (isNormalComboAttack) {
            if (this.animComboCount === 0) this.setHeroAnim(Animation.COMBO1);
            if (this.animComboCount === 1) this.setHeroAnim(Animation.COMBO2);
            if (this.animComboCount === 2) this.setHeroAnim(Animation.COMBO3);
        }
    }

    handleKeyPress() {
        switch (this.heroState) {
            case State.STAND:
                {
                    if (input[cc.macro.KEY.c] || input[cc.macro.KEY.j]) {
                        this.heroState = State.ATTACK;
                    }
                }
                break;
        }

        if (this.heroState === State.ATTACK) this.characterAttack();
        if (this.heroState === State.STAND) this.characterMove();
    }

    updateCharacterVelocity() {
        this.characterLv = this.heroRigidBody.linearVelocity;

        if (this.currentAnim === Animation.RUN) {
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
