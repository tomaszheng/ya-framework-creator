
const {ccclass, property} = cc._decorator;

@ccclass
export default class YADateUtils {

    static isSameWeek (self: number, other: number) {
        let day1 = ~~(self / 86400);
        let day2 = ~~(other / 86400);

        return (~~((day1 + 4) / 7)) === (~~((day2 + 4) / 7));
    }

}