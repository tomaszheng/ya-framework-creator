
const {ccclass, property} = cc._decorator;

@ccclass
export default class YADateUtils {

    static isSameWeek (other: number): boolean;
    static isSameWeek (self: number, other: number): boolean;
    static isSameWeek (): boolean {
        let self, other;
        if (arguments.length == 1) {
            self = new Date().getTime();
            other = arguments[0];
        }
        else if (arguments.length == 2) {
            self = arguments[0];
            other = arguments[1];
        }
        else
            return true;

        let day1 = ~~(self / 86400);
        let day2 = ~~(other / 86400);

        return (~~((day1 + 4) / 7)) === (~~((day2 + 4) / 7));
    }
}