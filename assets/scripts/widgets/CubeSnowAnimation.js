
/*
下方块雪动画
*/

//每一帧移动的距离
let FRAME_DISTANCE = 2;

//最多有多少个cube
let MAX_CUBE_NUM = 50;

//创建的频率
let CREATE_HZ = 30;

cc.Class({
    extends: cc.Component,

    properties: {
        pool: null,
        cubes: [],

        colors: [],

        direction: cc.Vec2,

        border: cc.Rect,

        sprite_frame: null,

        is_loadded: false,

        //能否继续创建cube
        is_create_enabed: true,
        //当前cube数量
        cur_cube_num: 0,

        //还有多少帧开始创建cube
        offset_frame_num: 0,

        //上一帧创建时的位置
        pre_position: 0,
    },

    ctor() {
        this.pool = new cc.NodePool();

        this.colors = [
            cc.color(229, 103, 107),
            cc.color(43, 195, 233),
            cc.color(229, 223, 39),
            cc.color(35, 217, 56),
            cc.color(71, 129, 232)
        ];

        //向下
        this.direction = cc.v2(0, -1);

        this.border = cc.rect(-200, -200, cc.winSize.width + 200, cc.winSize.height + 200);

        let img = new Image();
        img.onload = () => {
            let tex = new cc.Texture2D();
            tex.initWithElement(img);
            tex.handleLoadedTexture();
            this.sprite_frame = new cc.SpriteFrame(tex);
            this.is_loadded = true;

            this.createMaskLayer();
        };
        img.src = ya.res64.cube_square;
    },

    update() {
        if (!this.is_loadded) return;

        //移动cube
        for (let cube, i = this.cubes.length - 1; i >= 0; i--) {
            cube = this.cubes[i];
            cube.x += this.direction.x * FRAME_DISTANCE;
            cube.y += this.direction.y * FRAME_DISTANCE;

            if (cube.x < this.border.x || cube.x > this.border.width ||
                cube.y < this.border.y || cube.y > this.border.height)
            {
                this.pool.put(cube);
                this.cubes.splice(i, 1);
            }
        }
    },

    lateUpdate() {
        if (!this.is_loadded) return;

        this.offset_frame_num--;
        if (this.offset_frame_num > 0) return;
        this.offset_frame_num = CREATE_HZ;

        let cube;
        if (this.pool.size() > 0) {
            cube = this.pool.get();
        }
        else if (this.is_create_enabed) {
            cube = this.createCube();
        }

        if (cube) {
            cube.position = this.getRandomPosition();
            this.node.addChild(cube);
            this.cubes.push(cube);
        }
    },

    getRandomPosition() {
        let x = 0, y = 0;
        if (this.direction.x !== 0) {
            if (this.direction.x < 0) {
                x = -100;
            }
            else {
                x = cc.winSize.width + 100;
            }
            let ry = cc.misc.lerp(100, cc.winSize.height - 100, Math.random());
            y = (this.pre_position + ry) % (cc.winSize.height + 60) - 30;

            this.pre_position = y;
        }
        else {
            let rx = cc.misc.lerp(100, cc.winSize.width - 100, Math.random());
            x = (this.pre_position + rx) % (cc.winSize.width + 60) - 30;
            y = cc.winSize.height + 100;

            this.pre_position = x;
        }
        return cc.v2(x, y);
    },

    create(params) {
        let cube = new cc.Node();
        let sprite = cube.addComponent(cc.Sprite);
        sprite.type = cc.Sprite.Type.SLICED;
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        sprite.spriteFrame = this.sprite_frame;
        cube.color = params.color;
        cube.anchorX = params.ax;
        cube.anchorY = params.ay;
        cube.opacity = params.opacity;
        cube.setContentSize(params.size);
        return cube;
    },

    createCube() {

        this.cur_cube_num++;

        if (this.cur_cube_num >= MAX_CUBE_NUM) {
            this.is_create_enabed = false;
        }

        return this.create({
            ax: 0.5, ay: 0.5,
            opacity: 100,
            size: cc.size(100, 100),
            color: this.colors[Math.round(cc.misc.lerp(0, this.colors.length - 1, Math.random()))]
        });
    },

    createMaskLayer() {
        let cube = this.create({
            ax: 0, ay: 0,
            opacity: 155,
            size: cc.size(cc.winSize.width, cc.winSize.height),
            color: cc.color(255, 255, 255)
        });
        this.node.addChild(cube, 1);
    },

});