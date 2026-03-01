import { Database } from 'sql.js';
type Params = Record<string, unknown>;
type Row = Record<string, unknown>;
export declare class DatabaseService {
    private db;
    constructor(database: Database);
    select<T = Row>(tableName: string, columns?: string, where?: string, orderBy?: string, placeholders?: Params): T[];
    selectWithCount(tableName: string, countColumn: string, where?: string, placeholders?: Params): {
        total: number;
    }[];
    selectPaged<T = Row>(tableName: string, columns?: string, where?: string, placeholders?: Params, limit?: number, offset?: number): T[];
    insert(tableName: string, data: Params): number;
    update(tableName: string, data: Params, where?: string, placeholders?: Params): number;
    delete(tableName: string, where?: string, placeholders?: Params): number;
    insertIfEmpty(tableName: string, data: Params): boolean;
    findDuplicates(tableName: string, column: string): string[];
    getOne<T = Row>(tableName: string, where: string, placeholders?: Params): T | undefined;
    raw(sql: string, params?: Params): unknown;
}
export declare const dbService: DatabaseService;
export {};
//# sourceMappingURL=DatabaseService.d.ts.map