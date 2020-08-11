
class YaDateUtils {
    public static isSameWeek (self: number, other?: number): boolean {
        if (arguments.length === 1) {
            self = new Date().getTime();
            other = arguments[0];
        }

        const day1 = ~~(self / 86400);
        const day2 = ~~(other / 86400);

        return (~~((day1 + 4) / 7)) === (~~((day2 + 4) / 7));
    }
}

export {YaDateUtils};