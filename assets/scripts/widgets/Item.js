
cc.Class({
    extends: cc.Node,

    ctor() {
        let sprite = this.addComponent(cc.Sprite);
        sprite.spriteFrame = ya.rm.getSpriteFrame(ya.tex.unity_circle_bg);
        this.color = cc.color(150, 150, 150);
        let button = this.addComponent(cc.Button);
        button.transition = cc.Button.Transition.SCALE;
        button.target = this;
    },

    init(params) {
        params = params || {};
        this.mode = params.mode || ya.const.ITEM_MODE.MIX;
        this.click_cb = params.click_cb;

        this.bubble_enabled = params.bubble || false;
        this.power_enabled = params.power || false;
        
        this.num = params.num || 0;

        let str = "", res = "";
        if (this.mode === ya.const.ITEM_MODE.MIX) {
            str = ya.txt.item_mix;
            res = ya.tex.game_item_mix;
        }
        else if (this.mode === ya.const.ITEM_MODE.DYE) {
            str = ya.txt.item_dye;
            res = ya.tex.game_item_dye;
        }
        else if (this.mode === ya.const.ITEM_MODE.BOMB) {
            str = ya.txt.item_bomb;
            res = ya.tex.game_item_bomb;
        }
        this.mode_str = str;
        this.mode_res = res;

        this.initUI();

        this.initClick();
    },

    initUI() {
        this.lbl_mode = null;
        this.img_power_bg = null;
        this.lbl_num = null;

        // let lbl_mode = new cc.Node();
        // let lbl = lbl_mode.addComponent(cc.Label);
        // lbl.string = this.mode_str;
        // lbl.fontSize = 25;
        // lbl.lineHeight = 40;
        // this.addChild(lbl_mode);
        // this.lbl_mode = lbl_mode;

        this.setContentSize(cc.size(100, 100));
        
        let icon_node = new cc.Node();
        let icon_sprite = icon_node.addComponent(cc.Sprite);
        icon_sprite.spriteFrame = ya.rm.getSpriteFrame(this.mode_res);
        this.addChild(icon_node);

        if (this.power_enabled) {
            this.initPower();
        }
    },

    initClick() {
        let start_time = 0, end_time;
        ya.utils.addTouchEvent(this,
            (event) => {
                end_time = new Date().getTime();
                if (end_time - start_time < 500) {
                    this.click_cb && this.click_cb(this.mode);
                }
                else {
                    this.bubble_enabled && (this.onLongPress());
                }
            }, null,
            (event) => {
                start_time = new Date().getTime();
            }
        );
    },

    onLongPress() {

    },

    initPower() {
        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = ya.rm.getSpriteFrame(ya.tex.game_item_circle);
        // node.scale = 0.3;
        // node.color = cc.color(255, 0, 0);
        node.position = cc.v2(40, 40);
        this.addChild(node);
        this.img_power_bg = node;

        let lbl_num = new cc.Node();
        let lbl = lbl_num.addComponent(cc.Label);
        lbl.string = (this.num || "+").toString();
        lbl.fontSize = 20;
        lbl.lineHeight = 20;
        lbl_num.position = cc.v2(40, 40);
        this.addChild(lbl_num);
        this.lbl_num = lbl_num;
    },

    setPower(num) {
        this.num = num;

        if (!this.img_power_bg) {
            this.initPower();
        }
        else {
            this.lbl_num.getComponent(cc.Label).string = (this.num || "+").toString();
        }
    },
});
