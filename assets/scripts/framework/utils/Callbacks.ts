type VoidCallback = () => void;
type GeneralCallback = (...args) => void;
type ResultCallback = (code: number, data?: any) => void;
type ResponseCallback = (err: Error, data?: any) => void;
