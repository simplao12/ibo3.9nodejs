"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsApiController = void 0;
const DatabaseService_1 = require("../../services/DatabaseService");
const EncryptionService_1 = require("../../services/EncryptionService");
class DnsApiController {
    handle(req, res) {
        const rows = DatabaseService_1.dbService.select('dns', 'title AS name, url');
        const jsonString = JSON.stringify(rows, null, 2);
        const key1 = (0, EncryptionService_1.generateRandomKey)(16);
        const encrypted = (0, EncryptionService_1.dnsEncrypt)(jsonString, key1, key1);
        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.send(encrypted);
    }
}
exports.DnsApiController = DnsApiController;
//# sourceMappingURL=DnsApiController.js.map