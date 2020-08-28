import {ya} from "../framework/ya";

class AdManager extends ya.Singleton<AdManager> {

}

const adManager = AdManager.instance(AdManager);
export {adManager};
