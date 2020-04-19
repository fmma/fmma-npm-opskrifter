export interface PageInfo {
    path: string;
    title: string;
    component: React.ComponentClass<any, any>;
}

const pages: Map<string, PageInfo> = new Map();

export function getPages(): PageInfo[] {
    return Array.from(pages.values());
}

export function registerPage(pageInfo: PageInfo) {
    if(pages.has(pageInfo.path))
        throw new Error("Page re-registered: " + pageInfo.path + " " + pageInfo.title);
    pages.set(pageInfo.path, pageInfo);
}

export function unregisterPage(path: string) {
    pages.delete(path);
}
