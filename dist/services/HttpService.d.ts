/**
 * Port of PHP calllink::run() - HTTP GET request to external APIs
 */
export declare function callLink(url: string): Promise<{
    result: 'success' | 'error';
    data?: unknown;
}>;
//# sourceMappingURL=HttpService.d.ts.map