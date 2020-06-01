
/*
视图的基础类
*/

const {ccclass, property} = cc._decorator;

@ccclass
export default class YAView extends cc.Component {

    data: any = null;

    init (data: any) {
        data = data || {}
        
        this.data = data;

        this.onInitData(data);

        this.onInitUI();

        this.onInitEvent();

        this.onInitClick();
    }

    /**
     * 初始化数据
     * @param data 创建视图时传进来的数据
     */
    onInitData (data: any) {

    }

    /**
     * 初始化UI
     */
    onInitUI () {

    }

    /**
     * 初始化数据发生变化时的监听
     */
    onInitEvent () {

    }

    /**
     * 初始化视图中的按钮点击事件
     */
    onInitClick () {

    }
    /**
     * 视图被销毁
     */
    onDestroy() {

    }
    
}