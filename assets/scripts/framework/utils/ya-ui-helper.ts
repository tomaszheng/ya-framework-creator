import {YaBaseComponent} from "../base/YaBaseComponent";
import {yaResourceManager} from "../manager/ya-resource-manager";

class YaUIHelper {
    public static getCanvasSize() {
        return cc.find('Canvas').getContentSize();
    }

    /**
     * 实例化Prefab（由prefabPath指定prefab），注意：必须在YaBaseComponent及子类中调用，否则资源会泄露
     * @param prefabPath prefab路径
     * @param data 实例化后传给component的初始化数据
     * @param parent 父节点
     */
    public static async instantiatePath(prefabPath: string, data?: any, parent?: cc.Node) {
        return new Promise<cc.Node>((resolve, reject) => {
            yaResourceManager.load(prefabPath, cc.Prefab).then((prefab: cc.Prefab) => {
                const node = this.instantiate(prefab, data, parent);
                const component = node.getComponent(YaBaseComponent);
                if (component) {
                    component.instantiatedPrefabPath = prefabPath;
                    component.addRef(prefabPath, cc.Prefab);
                }
                resolve(node);
            }).catch((err: Error) => {
                reject(err);
            });
        });
    }

    public static instantiate(prefab: cc.Prefab, data?: any, parent?: cc.Node): cc.Node {
        const node: cc.Node = cc.instantiate(prefab);
        node.parent = parent;
        const component = node.getComponent(YaBaseComponent);
        if (component) component.init(data);
        return node;
    }
}

const yaUIHelper = YaUIHelper;
export {yaUIHelper};
