export type Context = {
    body: any,
    meta: any,
    storage: { set(), get() },
    query: any,
    secrets: any,
    headers: any,
    data: any,
};
