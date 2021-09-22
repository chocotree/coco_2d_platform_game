import { debugLog } from '../devUtils/debugLog';

const { ccclass, property } = cc._decorator;

const enum Animation {
    Idle = 'idle',
    HURT = 'hurt',
}

@ccclass
export default class NewClass extends cc.Component {
    @property
    hp: number = 5;

    /** character animation component */
    private characterAnim: cc.Animation;

    onLoad() {
        this.characterAnim = this.node.getComponent(cc.Animation);
    }

    onDestroy() {
        debugLog('enemy is dead');
    }

    replayCharacterAnim(animName: Animation) {
        this.characterAnim.stop(animName);
        this.characterAnim.play(animName);
    }

    onCollisionEnter(other: cc.BoxCollider) {
        const isHeroHit = other.node.name === 'hero';

        if (isHeroHit) {
            this.hp--;
            debugLog('enemy hp left:', this.hp);
            this.replayCharacterAnim(Animation.HURT);
            if (this.hp <= 0) this.node.destroy();
        }
    }

    // update(dt) {}
}
