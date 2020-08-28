class YaDateUtils {
    public static isSameWeek(self: number, other?: number): boolean {
        other = other || new Date().getTime();

        const day1 = ~~(self / 86400);
        const day2 = ~~(other / 86400);

        return (~~((day1 + 4) / 7)) === (~~((day2 + 4) / 7));
    }
}

const yaDateUtils = YaDateUtils;
export {yaDateUtils};
