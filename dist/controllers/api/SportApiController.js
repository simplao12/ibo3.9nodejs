"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SportApiController = void 0;
const axios_1 = __importDefault(require("axios"));
class SportApiController {
    async handle(req, res) {
        try {
            const response = await axios_1.default.get('https://widget.tvsportguide.com', {
                timeout: 5000,
                responseType: 'text',
            });
            res.set('Content-Type', 'text/html');
            res.send(response.data);
        }
        catch {
            res.status(500).send('Failed to fetch sports widget');
        }
    }
}
exports.SportApiController = SportApiController;
//# sourceMappingURL=SportApiController.js.map