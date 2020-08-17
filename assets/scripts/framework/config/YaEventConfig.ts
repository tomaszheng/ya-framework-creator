

let __uuid = 0;
let uuid = ()=>{
    return "ya-ekey" + (__uuid++).toString();
}

let YaEventConfig = {

    ON_SHOW: uuid(), //切前台
    ON_HIDE: uuid(), //切后台

};

export default YaEventConfig;
