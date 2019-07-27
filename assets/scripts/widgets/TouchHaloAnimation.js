
let MAX_NUM = 5;

cc.Class({

    extends: cc.Component,

    properties: {
        is_touching: false,
        is_moving: false,

        pre_halo_time: 0,
    },
    
    ctor() {
        this.pool = new cc.NodePool();

        this.cur_halo_pos = null;
        this.pre_halo_pos = null;

        this.halos = [];
    },

    start() {
        this.initTouch();
    },

    initTouch() {
        ya.utils.addTouchEvent(this.node, 
            (event) => {
                this.cur_halo_pos = event.touch.getLocation();
                this.is_touching = false;
                this.runHaloAction(this.cur_halo_pos, 0.4);
            }, 
            (event) => {
                this.cur_halo_pos = event.touch.getLocation();
                let t = new Date().getTime();
                if (t - this.pre_halo_time >= 50) {
                    this.runHaloAction(this.cur_halo_pos);
                    this.pre_halo_time = t;
                }
                this.is_moving = true;
            }, 
            (event) => {
                this.pre_halo_time = new Date().getTime();
                this.is_touching = true;
                this.cur_halo_pos = event.touch.getLocation();
                this.runHaloAction(this.cur_halo_pos);
            },
            (event)=>{
                this.is_touching = false;
            });
    },

    update() {
        if (this.is_touching) {
            let t = new Date().getTime();
            if (this.is_moving) {
                if (t - this.pre_halo_time >= 100 &&
                    (Math.abs(this.cur_halo_pos.x - this.pre_halo_pos.x) > 10 ||
                        Math.abs(this.cur_halo_pos.y - this.pre_halo_pos.y) > 10)) {
                    this.runHaloAction(this.cur_halo_pos);
                    this.pre_halo_time = t;
                    this.is_moving = false;
                }
                else if (t - this.pre_halo_time >= 100) {
                    this.is_moving = false;
                }
            }
            else if (t - this.pre_halo_time >= 1000) {
                this.runHaloAction(this.cur_halo_pos);
                this.pre_halo_time = t;
            }
        }
    },

    getHalo() {
        let halo;
        if (this.pool.size() > 0) {
            halo = this.pool.get();
            halo.opacity = 255;
            halo.scale = 1.0;
        }
        else {
            halo = new cc.Node();
            let sprite = halo.addComponent(cc.Sprite);
            sprite.spriteFrame = ya.rm.getSpriteFrame(ya.tex.game_img_halo);
        }
        return halo;
    },

    runHaloAction(p, scale) {
        let halo;
        if (this.halos.length > MAX_NUM) {
            while (this.halos.length > MAX_NUM) {
                halo = this.halos.shift();
                halo.stopAllActions();
                this.pool.put(halo);
            }
        }

        halo = this.getHalo();

        halo.position = p;
        halo.scale = scale || 0.5;
        halo.runAction(cc.sequence(
            cc.spawn(cc.scaleTo(1, 1.5), cc.fadeOut(1)),
            cc.callFunc(() => {
                this.pool.put(this.halos.shift());
            })
        ));

        this.node.addChild(halo);
        this.halos.push(halo);

        this.pre_halo_pos = this.cur_halo_pos;
    },
});