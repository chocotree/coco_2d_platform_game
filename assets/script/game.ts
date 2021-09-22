import { devConfig } from './config/devConfig';

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    onLoad() {
        const physicsManager = cc.director.getPhysicsManager();
        const collisionManager = cc.director.getCollisionManager();
        physicsManager.enabled = true;
        collisionManager.enabled = true;

        if (devConfig.isDebugPhysics) {
            physicsManager.debugDrawFlags = 1;
        }

        if (devConfig.isDebugCollision) {
            collisionManager.enabledDebugDraw = true;
        }

        this.initMapNode(this.node);
    }

    initMapNode(ccNode: cc.Node) {
        // mapNode -> has wall
        const tiledMap = ccNode.getComponentInChildren(cc.TiledMap);
        const tiledSize = tiledMap.getTileSize();
        const layer = tiledMap.getLayer('wall');
        const layerWallSize = layer.getLayerSize();

        for (let i = 0; i < layerWallSize.width; i++) {
            for (let j = 0; j < layerWallSize.height; j++) {
                const tiled = layer.getTiledTileAt(i, j, true);
                this.drawWallPhysicsBoxColliders({
                    tiled,
                    colliderSize: tiledSize,
                });
            }
        }
    }

    drawWallPhysicsBoxColliders(params: { tiled: cc.TiledTile; colliderSize: cc.Size }) {
        const { tiled, colliderSize } = params;

        if (tiled.gid !== 0) {
            tiled.node.group = 'wall';

            const body = tiled.node.addComponent(cc.RigidBody);
            body.type = cc.RigidBodyType.Static;
            const collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
            collider.offset = cc.v2(colliderSize.width / 2, colliderSize.height / 2);
            collider.size = colliderSize;
            collider.apply();
        }
    }

    // start() {}

    // update (dt) {}
}
