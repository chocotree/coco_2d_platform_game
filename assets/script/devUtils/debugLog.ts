import { devConfig } from '../config/devConfig';

export const debugLog = (...args) => {
    if (!devConfig.isShowConsoleLog) return;

    console.log(...args);
};
