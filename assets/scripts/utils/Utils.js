
/*
帮助类
*/

cc.Class({

    clone(object) {
        if (!object || typeof (object) !== "object") {
            return object;
        }

        let Constructor = object.constructor;
        let ret = new Constructor();

        for (let attr in object) {
            if (object.hasOwnProperty(attr)) {
                let value = object[attr];

                if (value === object) {
                    return;
                }

                if (typeof (value) === "object") {
                    ret[attr] = this.clone(value);
                }
                else {
                    ret[attr] = value;
                }
            }
        }
        return ret;
    },

    addClickEvent(node, efunc) {
        node.on(cc.Node.EventType.TOUCH_END, (event) => {
            if (efunc) efunc(event);
            ya.music.playEffect(ya.res.sound_click);
            event.stopPropagation();
        });
    },

    addStartEvent(node, sfunc) {
        node.on(cc.Node.EventType.TOUCH_START, (event) => {
            if (sfunc) sfunc(event);
            event.stopPropagation();
        });
    },

    addMoveEvent(node, mfunc) {
        node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            if (mfunc) mfunc(event);
            event.stopPropagation();
        });
    },

    addCancelEvent(node, cfunc) {
        node.on(cc.Node.EventType.TOUCH_CANCEL, (event) => {
            if (cfunc) cfunc(event);
        });
    },

    addTouchEvent(node, efunc, mfunc, bfunc, cfunc) {
        node.on(cc.Node.EventType.TOUCH_END, (event) => {
            if (efunc) efunc(event);
            event.stopPropagation();
        });
        node.on(cc.Node.EventType.TOUCH_START, (event) => {
            if (bfunc) bfunc(event);
            event.stopPropagation();
        });
        node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            if (mfunc) mfunc(event);
            event.stopPropagation();
        });
        node.on(cc.Node.EventType.TOUCH_CANCEL, (event) => {
            if (cfunc) cfunc(event);
        });
    },

    isSameWeek(old_time, now_time) {
        old_time = old_time || new Date().getTime();
        now_time = now_time || new Date().getTime();

        let old_day = ~~(old_time / this.day_time);
        let now_day = ~~(now_time / this.day_time);

        return (~~((old_day + 4) / 7)) === (~~((now_day + 4) / 7));
    },

});