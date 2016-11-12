import Vec2 from 'vec2';
import QuadTree from 'simple-quadtree';

export default class Physics {
    constructor(cameraBody, levelBoundArr, distanceFactor = 1.5, timeStep = 10, gravity = 9.82) {
        this.cameraBody = cameraBody;
        this.physicsBodyArr = new Array();
        this.distanceFactor = distanceFactor;
        this.timeStep = timeStep;
        this.gravity = gravity; //units/(s^2)
        this.quadTree = new QuadTree(0, 0, levelBoundArr[0], levelBoundArr[1]);
    }

    addBody(physicsBody) {
        this.physicsBodyArr.push(physicsBody);
        this.cameraSort();
    }

    resolveView() {
        this.quadTree.clear();
        const physicsWindow = this.cameraBody.polygon.scale(this.distanceFactor, Vec2(this.cameraBody.position), true);

        for (const physicsBody of this.physicsBodyArr) {
            physicsBody.inView = this.collides(physicsBody, physicsWindow);//change to collides()
            this.resolveBody(physicsBody);

            this.quadTree.put(physicsBody);
        }

        for(physicsBody of this.physicsBodyArr) {
            if (physicsBody.inView) {
                const possibleCollidersArr = new Array();

                for (collider of possibleCollidersArr) {
                    if(this.collides(physicsBody, collider)) {
                        //stuff
                    }
                }
            }
        }

        return this;
    }

    resolveBody(physicsBody) {
        const tempBody = physicsBody.clone;

        tempBody.velocity[1] -= this.gravity * this.timeStep / 1000;
        for (let i = 0; i < tempBody.position.length; i++) {
            tempBody.position[i] += tempBody.velocity[i] * this.timeStep / 1000;
        }

        tempBody.position[1] = tempBody.position[1] < 0 ? 0 : tempBody.position[1];//TEST, everything fals to the ground

        //TODO collisions;
        physicsBody = tempBody;
    }

    cameraSort() {
        this.physicsBodyArr.sort((a,b) => Vec2(a.position).distance(Vec2(this.cameraBody.position)) - Vec2(b.position).distance(Vec2(this.cameraBody.position)));//sort by closest to cameraBody

        return this;
    }

    collides(physicsBody1, physicsBody2) {
        return !(physicsBody1.x + physicsBody1.w < physicsBody2.x
            || physicsBody1.x > physicsBody2.x + physicsBody2.w
            || physicsBody1.y + physicsBody1.h < physicsBody2.y
            || physicsBody1.y > physicsBody2.y + physicsBody2.h);
    }
}