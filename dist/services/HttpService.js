"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callLink = callLink;
const axios_1 = __importDefault(require("axios"));
/**
 * Port of PHP calllink::run() - HTTP GET request to external APIs
 */
async function callLink(url) {
    try {
        const response = await axios_1.default.get(url, {
            timeout: 5000,
            validateStatus: () => true,
        });
        if (response.data && Object.keys(response.data).length > 0) {
            return { result: 'success', data: response.data };
        }
        return { result: 'error' };
    }
    catch {
        return { result: 'error' };
    }
}
//# sourceMappingURL=HttpService.js.map