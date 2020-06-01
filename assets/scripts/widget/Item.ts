import ya from "../framework/ya";
import GameConstant from "../config/GameConstant";
import GameText from "../config/GameText";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Item extends cc.Node {
    mode: number = -1;
    click_cb: Function = null;
    bubble_enabled: boolean = false;
    power_enabled: boolean = false;
    num: number = 0;
    mode_str: string = "";
    mode_res: string = "";

    lbl_mode: cc.Node = null;
    img_power_bg: cc.Node = null;
    lbl_num: cc.Node = null;

    constructor () {
        super();

        let sprite = this.addComponent(cc.Sprite);
        sprite.spriteFrame = ya.resourceManager.getSpriteFrame('unity_circle_bg');
        this.color = cc.color(150, 150, 150);
        let button = this.addComponent(cc.Button);
        button.transition = cc.Button.Transition.SCALE;
        button.target = this;
    }

    init (params: any) {
        params = params || {};
        this.mode = params.mode || GameConstant.ITEM_MODE.MIX;
        this.click_cb = params.click_cb;

        this.bubble_enabled = params.bubble || false;
        this.power_enabled = params.power || false;
        
        this.num = params.num || 0;

        let str = "", res = "";
        if (this.mode === GameConstant.ITEM_MODE.MIX) {
            str = GameText.item_mix, res = "game_item_mix";
        }
        else if (this.mode === GameConstant.ITEM_MODE.DYE) {
            str = GameText.item_dye, res = "game_item_dye";
        }
        else if (this.mode === GameConstant.ITEM_MODE.BOMB) {
            str = GameText.item_bomb, res = "game_item_bomb";
        }
        this.mode_str = str, this.mode_res = res;

        this.initUI();

        this.initClick();
    }
    
    initUI() {
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
        icon_sprite.spriteFrame = ya.resourceManager.getSpriteFrame(this.mode_res);
        this.addChild(icon_node);

        if (this.power_enabled) {
            this.initPower();
        }
    }

    initClick () {
        let start_time: number = 0, end_time: number;
        ya.utils.addTouchEvent(this, (event: any) => {
                end_time = new Date().getTime();
                if (end_time - start_time < 500) {
                    this.click_cb && this.click_cb(this.mode);
                }
                else {
                    this.bubble_enabled && (this.onLongPress());
                }
            }, null,
            (event: any) => {
                start_time = new Date().getTime();
            });
    }

    onLongPress () {

    }

    initPower () {
        let node = new cc.Node();
        let sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = ya.resourceManager.getSpriteFrame("game_item_circle");
        node.position = cc.v3(40, 40);
        this.addChild(node);
        this.img_power_bg = node;

        let lbl_num = new cc.Node();
        let lbl = lbl_num.addComponent(cc.Label);
        lbl.string = (this.num || "+").toString();
        lbl.fontSize = 20;
        lbl.lineHeight = 20;
        lbl_num.position = cc.v3(40, 40);
        this.addChild(lbl_num);
        this.lbl_num = lbl_num;
    }

    setPower (num: number) {
        this.num = num;

        if (!this.img_power_bg) {
            this.initPower();
        }
        else {
            this.lbl_num.getComponent(cc.Label).string = (this.num || "+").toString();
        }
    }
}
