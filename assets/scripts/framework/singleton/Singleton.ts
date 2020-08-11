
class Singleton<T> {
    private static _instance: any = null;

    public static instance<T>(c: new() => T) : T {
        if (this._instance === null) {
            this._instance = new c();
        }
        return this._instance;
    }
}

export {Singleton};