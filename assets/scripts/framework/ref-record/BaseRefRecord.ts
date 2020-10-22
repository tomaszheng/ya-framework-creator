import {lodash} from "../libs/lib";
import {utils} from "../utils/Utils";

interface IRefRecord {
    bundleName: string;
    path: string;
    type: typeof cc.Asset;
    refCount: number;
}

class BaseRefRecord {
    private _refRecords: Map<string, IRefRecord[]> = new Map<string, IRefRecord[]>();

    private static addRefCount(bundleName: string, path: string, type: typeof cc.Asset) {
        const asset = BaseRefRecord.getAsset(bundleName, path, type);
        asset.addRef();
    }

    private static decRefCount(bundleName: string, path: string, type: typeof cc.Asset) {
        const asset = BaseRefRecord.getAsset(bundleName, path, type);
        asset.decRef(false);
    }

    private static getAsset(bundleName: string, path: string, type: typeof cc.Asset): cc.Asset {
        const bundle = cc.assetManager.getBundle(bundleName);
        return bundle.get(path, type);
    }

    public addRef(fullPath: string, type: typeof cc.Asset) {
        const {bundleName, path} = utils.parseBundlePath(fullPath);
        const refRecord = this.getOrCreateRefRecord(fullPath, type);
        refRecord.refCount++;
        BaseRefRecord.addRefCount(bundleName, path, type);
    }

    public decRef(fullPath: string, type: typeof cc.Asset) {
        const {bundleName, path} = utils.parseBundlePath(fullPath);
        const refRecord = this.getOrCreateRefRecord(fullPath, type);
        if (refRecord.refCount > 0) {
            refRecord.refCount--;
            BaseRefRecord.decRefCount(bundleName, path, type);
        }
    }

    public recordRef(fullPath: string, type: typeof cc.Asset) {
        this.getOrCreateRefRecord(fullPath, type);
    }

    public decAllRef() {
        this._refRecords.forEach((records: IRefRecord[]) => {
            records.every((refRecord: IRefRecord) => {
                lodash.times(refRecord.refCount, () => {
                    refRecord.refCount--;
                    BaseRefRecord.decRefCount(refRecord.bundleName, refRecord.path, refRecord.type);
                });
            });
        });
    }

    public getRefCount(fullPath: string, type: typeof cc.Asset): number {
        const refRecord = this.findRefRecord(fullPath, type);
        return !!refRecord ? refRecord.refCount : 0;
    }

    private findRefRecord(fullPath: string, type: typeof cc.Asset): IRefRecord {
        const {bundleName, path} = utils.parseBundlePath(fullPath);
        if (this._refRecords.has(bundleName)) {
            const records = this._refRecords.get(bundleName);
            return this.getRefRecord(records, path, type);
        }
        return null;
    }

    private getOrCreateRefRecord(fullPath: string, type: typeof cc.Asset): IRefRecord {
        const {bundleName, path} = utils.parseBundlePath(fullPath);
        if (!this._refRecords.has(bundleName)) {
            this._refRecords.set(bundleName, [{bundleName, path, type, refCount: 0}]);
        }
        const records = this._refRecords.get(bundleName);
        let refRecord = this.getRefRecord(records, path, type);
        if (!refRecord) {
            refRecord = {bundleName, path, type, refCount: 0};
            records.push(refRecord);
        }
        return refRecord;
    }

    private getRefRecord(records: IRefRecord[], path: string, type: typeof cc.Asset): IRefRecord {
        let foundRecord: IRefRecord = null;
        records.some((record: IRefRecord) => {
            if (path === record.path && type === record.type) {
                foundRecord = record;
                return true;
            }
        });
        return foundRecord;
    }

    public getBundleNames() {
        const keys = this._refRecords.keys();
        return Array.from(keys);
    }

    public clear() {
        this.decAllRef();
        this._refRecords = new Map<string, IRefRecord[]>();
    }

    public dump() {
        this._refRecords.forEach((records: IRefRecord[]) => {
            records.forEach((refRecord: IRefRecord) => {
                const {bundleName, path, type, refCount} = refRecord;
                cc.log(`bundle name = ${bundleName}, path = ${path}, type = ${type}, refCount = ${refCount}`);
            });
        });
    }
}

export {BaseRefRecord};
