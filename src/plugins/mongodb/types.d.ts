declare type ModelExC<T> = import('mongoose').Model<T>
declare type DocumentExC = import('mongoose').Document

declare interface Models {
    UserModel: UserModelI;
    FormationModel: FormationModelI;
    SpecialtyModel: SpecialtyModelI;
    SystemModel: SystemModelI;
}

declare interface Db {
    models: Models;
}

// define options
declare interface MyPluginOptions {
}