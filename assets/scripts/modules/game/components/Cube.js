
cc.Class({
    extends: cc.Component,

    properties: {
        dst_color: null,
        duration: 0,
        color_mode: 0,
    },
    
    fill(params) {
        this.color_mode = params.color_mode,

        this.node.rotation = params.rotation === undefined ? 0 : params.rotation;
        this.node.scale = params.scale === undefined ? 1.0 : params.scale;
        this.node.color = params.color === undefined ? cc.color(255, 255, 255) : params.color;
        this.node.anchorX = params.ax === undefined ? 0.5 : params.ax;
        this.node.anchorY = params.ay === undefined ? 0.5 : params.ay;
        this.node.opacity = params.opacity === undefined ? 255 : params.opacity;
        this.node.setContentSize(params.size || cc.size(10, 10));

        let sprite = this.node.getComponent(cc.Sprite);
        let tex = sprite.spriteFrame && sprite.spriteFrame.getTexture();
        let url = params.url || ya.tex.game_cube_square;
        if (!tex || tex.url !== url) {
            sprite.spriteFrame = ya.rm.getSpriteFrame(url);
        }
    },

    init(params) {
        let sprite = this.node.addComponent(cc.Sprite);
        sprite.type = cc.Sprite.Type.SLICED;
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        this.fill(params);
    },

    setSpriteFrame(url) {
        let sprite = this.node.getComponent(cc.Sprite);
        sprite.spriteFrame = ya.rm.getSpriteFrame(url);
    }
});