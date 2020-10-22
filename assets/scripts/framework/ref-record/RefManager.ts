import {Singleton} from "../singleton/Singleton";
import {BaseRefRecord} from "./BaseRefRecord";

class RefManager extends Singleton<RefManager> {
    private _refRecords: Map<string, BaseRefRecord> = new Map<string, BaseRefRecord>();

    public getOrCreateRefRecord(name: string) {
        console.assert(!this._refRecords.has(name), "Ref record's name is duplicated!");
        const refRecord = new BaseRefRecord();
        this._refRecords.set(name, refRecord);
        return refRecord;
    }

    public deleteRefRecord(name: string) {
        if (this._refRecords.has(name)) {
            this._refRecords.delete(name);
        }
    }

    public getAllBundleNames() {
        const allBundleNames = [];
        this._refRecords.forEach((refRecord: BaseRefRecord) => {
            const bundleNames = refRecord.getBundleNames();
            allBundleNames.concat(bundleNames);
        });
        return allBundleNames;
    }

    public dump() {
        cc.log('start dump ref record ...');
        this._refRecords.forEach((record: BaseRefRecord) => {
            record.dump();
        });
        cc.log('dump ref record finish.');
    }
}

const refManager = RefManager.instance(RefManager);
export {refManager};
