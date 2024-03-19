type ReqHeaders = {
    authorization: string,
    // deviceid: string
}

declare interface AuthReqData {
    Headers: ReqHeaders
}

declare interface SimpleReqData {
    // Headers: Pick<ReqHeaders, 'deviceid'>
}

declare interface RouteWithAuth<T> extends AuthReqData {
    Body: T
}
declare interface RouteWithData<T> extends SimpleReqData {
    Body: T
}

declare interface GetReqWithQueryParams<T> extends AuthReqData {
    Querystring: T
}

declare interface ReqData<T> {
    data: T
}
