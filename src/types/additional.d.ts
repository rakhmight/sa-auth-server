declare type InternationalNameValue = {
    ISOCode: ShortListOfISOCountryCodes,
    value: string
}

declare enum ShortListOfISOCountryCodes {
    RU = 'RU', // russian
    EN = 'EN', // english
    UZ = 'UZ', // uzbek (1st - lotin, 2nd - kiril)

    FR = 'FR', // france
    DE = 'DE', // dutch
    JP = 'JP', // japanese
    CN = 'CN', // chinese
    KR = 'KR', // korean
    IT = 'IT', // italian
    BY = 'BY', // belarus
    IN = 'IN', // indian
    UA = 'UA', // ukraine

    TJ = 'TJ', // tajik
    TR = 'TR', // turk
    TM = 'TM', // turkmen
    KZ = 'KZ', // kazakh
    AF = 'AF', // afghan
    AZ = 'AZ', // azerbaij
    IR = 'IR', // iran
    IQ = 'IQ' // iraq
}

declare type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;