
#ign_ts
#ts

#telegram 

# ```TS
<!-- basicblock-start  deck='ign_ts' -->
```TS::


/**
 * Декораторы модулей
 * Документация
 *** **https://docs.google.com/document/d/1xefriIChFAEwAi2VqBhqawNPG75K9qWLWYA2p1IQfgk/edit****
 */
import * as angular from "angular";
import {IController, IControllerConstructor, IDirectiveFactory, IModule, Injectable} from "angular";
import {IAmdComponentOptions} from ".****/component****.decorator";
import lodash = require("../../../vendor/lodash/lodash");
import {IPipeConstructor} from ".****/pipe****.decorator";


/**
 * Декоратор модуля
 * @param {TModuleDecoratorParams} params
 * @returns {<T extends IAmdModuleOptions>(constructor: T) => void}
 */
export function Module(params: TModuleDecoratorParams)
{
    return <T extends IAmdModuleOptions>(constructor: T) =>
    {
        const moduleName = lodash.camelCase(constructor.name);
        const requires   = (params.imports  []).map(v => v.moduleName);
        const module     = angular.module(moduleName, requires);

        loadModuleControllers(module, params.controller  []);
        loadModuleDeclarations(module, params.declarations  []);
        loadModuleFilters(module, params.filters  []);
        loadModuleProviders(module, params.providers || []);

        if (params.configurator) {
            module.config(params.configurator);
        }

        if (params.run) {
            module.run(params.run);
        }

        constructor.moduleName = moduleName;
        constructor.module     = module;
    };
}

/**
 * подгрузка контроллеров
 *** **@param**** module
 *** **@param**** declarations
 */
function loadModuleControllers(module: IModule, declarations: TAmdModuleController[]) {
    declarations.forEach((v) => {
        module.controller(****v.name****, v.controller);
    });
}


/**
 * Загрузка компонентов и директив
 * @param {angular.IModule} module
 * @param {TAmdModuleDeclaration[]} declarations
 * @returns {void}
 */
function loadModuleDeclarations(module: IModule, declarations: TAmdModuleDeclaration[])
{
    declarations.map(v =>
    {
        if ((v as TAmdModuleDirectiveOptions).factory) {
            module.directive(lodash.camelCase(v.selector), (v as TAmdModuleDirectiveOptions).factory);
        } else {
            module.component(lodash.camelCase(v.selector), v as IAmdComponentOptions);
        }
    });
}


/**
 * Загрузка фильтров
 */
function loadModuleFilters(module: IModule, filters: TAmdModuleFilter[])
{**
    **filters.map****((v) =>
    {
        if ('factory' in v) {
            module.filter(****v.name****, v.factory)
        } else {
            const factory = (...args: any[]) =>
            {
                const instance = new v(...args);
                return instance.transform.bind(instance);
            };

            factory.$inject = v.$inject;

            module.filter(v.pipeName, factory);
        }
    });
}


/**
 * Загрузка сервисов
 * @param {angular.IModule} module
 * @param {TAmdModuleProvider[]} providers
 * @returns {void}
 */
function loadModuleProviders(module: IModule, providers: TAmdModuleProvider[])
{
    for (let provider of providers) {
        if (!provider.provide) {
            console.error('Необходимо назвать сервис', provider);
        }
        if (provider.hasOwnProperty('useValue')) {
            module.value(provider.provide, (provider as TAmdValueProvider).useValue);
        } else if (provider.hasOwnProperty('useClass')) {
            module.service(provider.provide, (provider as TAmdClassProvider).useClass);
        }
    }
}


/**
 * Параметры директив модуля
 */
export interface TAmdModuleDirectiveOptions
{
    selector: string,
    factory: IDirectiveFactory|Array<any|IDirectiveFactory>,
}


/**
 * Параметры фильтров модуля
 */
export interface TAmdModuleFilterOptions
{
    name: string,
    factory: Injectable<Function>,
}

type TAmdModuleFilter = TAmdModuleFilterOptions | IPipeConstructor;

```
<!-- basicblock-end -->




#ign_ts
#ts

#telegram 

# ```TS
<!-- basicblock-start  deck='ign_ts' -->
```TS::

/**
 * Декораторы модулей
 * Документация
 *** **https://docs.google.com/document/d/1xefriIChFAEwAi2VqBhqawNPG75K9qWLWYA2p1IQfgk/edit****
 */
import * as angular from "angular";
import {IController, IControllerConstructor, IDirectiveFactory, IModule, Injectable} from "angular";
import {IAmdComponentOptions} from ".****/component****.decorator";
import lodash = require("../../../vendor/lodash/lodash");
import {IPipeConstructor} from ".****/pipe****.decorator";


/**
 * Декоратор модуля
 * @param {TModuleDecoratorParams} params
 * @returns {<T extends IAmdModuleOptions>(constructor: T) => void}
 */
export function Module(params: TModuleDecoratorParams)
{
    return <T extends IAmdModuleOptions>(constructor: T) =>
    {
        const moduleName = lodash.camelCase(constructor.name);
        const requires   = (params.imports  []).map(v => v.moduleName);
        const module     = angular.module(moduleName, requires);

        loadModuleControllers(module, params.controller  []);
        loadModuleDeclarations(module, params.declarations  []);
        loadModuleFilters(module, params.filters  []);
        loadModuleProviders(module, params.providers || []);

        if (params.configurator) {
            module.config(params.configurator);
        }

        if (params.run) {
            module.run(params.run);
        }

        constructor.moduleName = moduleName;
        constructor.module     = module;
    };
}

/**
 * подгрузка контроллеров
 *** **@param**** module
 *** **@param**** declarations
 */
function loadModuleControllers(module: IModule, declarations: TAmdModuleController[]) {
    declarations.forEach((v) => {
        module.controller(****v.name****, v.controller);
    });
}


/**
 * Загрузка компонентов и директив
 * @param {angular.IModule} module
 * @param {TAmdModuleDeclaration[]} declarations
 * @returns {void}
 */
function loadModuleDeclarations(module: IModule, declarations: TAmdModuleDeclaration[])
{
    declarations.map(v =>
    {
        if ((v as TAmdModuleDirectiveOptions).factory) {
            module.directive(lodash.camelCase(v.selector), (v as TAmdModuleDirectiveOptions).factory);
        } else {
            module.component(lodash.camelCase(v.selector), v as IAmdComponentOptions);
        }
    });
}


/**
 * Загрузка фильтров
 */
function loadModuleFilters(module: IModule, filters: TAmdModuleFilter[])
{**
    **filters.map****((v) =>
    {
        if ('factory' in v) {
            module.filter(****v.name****, v.factory)
        } else {
            const factory = (...args: any[]) =>
            {
                const instance = new v(...args);
                return instance.transform.bind(instance);
            };

            factory.$inject = v.$inject;

            module.filter(v.pipeName, factory);
        }
    });
}


/**
 * Загрузка сервисов
 * @param {angular.IModule} module
 * @param {TAmdModuleProvider[]} providers
 * @returns {void}
 */
function loadModuleProviders(module: IModule, providers: TAmdModuleProvider[])
{
    for (let provider of providers) {
        if (!provider.provide) {
            console.error('Необходимо назвать сервис', provider);
        }
        if (provider.hasOwnProperty('useValue')) {
            module.value(provider.provide, (provider as TAmdValueProvider).useValue);
        } else if (provider.hasOwnProperty('useClass')) {
            module.service(provider.provide, (provider as TAmdClassProvider).useClass);
        }
    }
}


/**
 * Параметры директив модуля
 */
export interface TAmdModuleDirectiveOptions
{
    selector: string,
    factory: IDirectiveFactory|Array<any|IDirectiveFactory>,
}


/**
 * Параметры фильтров модуля
 */
export interface TAmdModuleFilterOptions
{
    name: string,
    factory: Injectable<Function>,
}

type TAmdModuleFilter = TAmdModuleFilterOptions | IPipeConstructor;
```
<!-- basicblock-end -->




#ign_ts
#ts

#telegram 

# ```TS
<!-- basicblock-start  deck='ign_ts' -->
```TS::

/**
 * Параметры декоратора модуля
 */
export interface TModuleDecoratorParams
{
    imports?: Array<IAmdModuleOptions | TAmdOldModuleOptions>,
    declarations?: TAmdModuleDeclaration[],
    // providers?: Array<any>,
    filters?: TAmdModuleFilter[],
    providers?: TAmdModuleProvider[],
    configurator?: Function,
    controller?: TAmdModuleController[],
    run?: Function
}

export type TAmdModuleController = {
    name: string,
    controller: Injectable<ng.IControllerConstructor>
} | { new(...args: any[]): IController, controller?: Injectable<IControllerConstructor> }

/**
 * Интерфейс модуля
 */
export interface IAmdModuleOptions
{
    moduleName?: string;
    module?: IModule;
    configure?: (params?: any) => IAmdModuleOptions


    new(...args: any[]): any;
}

export interface TAmdValueProvider
{
    provide: string;

    useValue: any;
}

export interface TAmdClassProvider
{
    provide: string;
    useClass: { new(...args: any[]): any } | Function;
}

export interface TAmdConstructorProvider extends Partial<TAmdClassProvider>{
    new(...args: any[]): any;
}

export declare type TAmdModuleProvider = TAmdValueProvider | TAmdClassProvider | TAmdConstructorProvider;
export declare type TAmdModuleDeclaration = IAmdComponentOptions | TAmdModuleDirectiveOptions;


/**
 * Тип для объявления модулей созданых без декоратора
 * {moduleName: 'ngMaterial'}
 */
export interface TAmdOldModuleOptions
{
    moduleName: string
}
```
<!-- basicblock-end -->




#ign_ts
#ts

#telegram 

# /**
<!-- basicblock-start  deck='ign_ts' -->
/**::

 * Декораторы модулей
 * Документация
 *** **https://docs.google.com/document/d/1xefriIChFAEwAi2VqBhqawNPG75K9qWLWYA2p1IQfgk/edit****
 */
import * as angular from "angular";
import {IController, IControllerConstructor, IDirectiveFactory, IModule, Injectable} from "angular";
import {IAmdComponentOptions} from ".****/component****.decorator";
import lodash = require("../../../vendor/lodash/lodash");
import {IPipeConstructor} from ".****/pipe****.decorator";


/**
 * Декоратор модуля
 * @param {TModuleDecoratorParams} params
 * @returns {<T extends IAmdModuleOptions>(constructor: T) => void}
 */
export function Module(params: TModuleDecoratorParams)
{
    return <T extends IAmdModuleOptions>(constructor: T) =>
    {
        const moduleName = lodash.camelCase(constructor.name);
        const requires   = (params.imports  []).map(v => v.moduleName);
        const module     = angular.module(moduleName, requires);

        loadModuleControllers(module, params.controller  []);
        loadModuleDeclarations(module, params.declarations  []);
        loadModuleFilters(module, params.filters  []);
        loadModuleProviders(module, params.providers || []);

        if (params.configurator) {
            module.config(params.configurator);
        }

        if (params.run) {
            module.run(params.run);
        }

        constructor.moduleName = moduleName;
        constructor.module     = module;
    };
}

/**
 * подгрузка контроллеров
 *** **@param**** module
 *** **@param**** declarations
 */
function loadModuleControllers(module: IModule, declarations: TAmdModuleController[]) {
    declarations.forEach((v) => {
        module.controller(****v.name****, v.controller);
    });
}


/**
 * Загрузка компонентов и директив
 * @param {angular.IModule} module
 * @param {TAmdModuleDeclaration[]} declarations
 * @returns {void}
 */
function loadModuleDeclarations(module: IModule, declarations: TAmdModuleDeclaration[])
{
    declarations.map(v =>
    {
        if ((v as TAmdModuleDirectiveOptions).factory) {
            module.directive(lodash.camelCase(v.selector), (v as TAmdModuleDirectiveOptions).factory);
        } else {
            module.component(lodash.camelCase(v.selector), v as IAmdComponentOptions);
        }
    });
}


/**
 * Загрузка фильтров
 */
function loadModuleFilters(module: IModule, filters: TAmdModuleFilter[])
{**
    **filters.map****((v) =>
    {
        if ('factory' in v) {
            module.filter(****v.name****, v.factory)
        } else {
            const factory = (...args: any[]) =>
            {
                const instance = new v(...args);
                return instance.transform.bind(instance);
            };

            factory.$inject = v.$inject;

            module.filter(v.pipeName, factory);
        }
    });
}


/**
 * Загрузка сервисов
 * @param {angular.IModule} module
 * @param {TAmdModuleProvider[]} providers
 * @returns {void}
 */
function loadModuleProviders(module: IModule, providers: TAmdModuleProvider[])
{
    for (let provider of providers) {
        if (!provider.provide) {
            console.error('Необходимо назвать сервис', provider);
        }
        if (provider.hasOwnProperty('useValue')) {
            module.value(provider.provide, (provider as TAmdValueProvider).useValue);
        } else if (provider.hasOwnProperty('useClass')) {
            module.service(provider.provide, (provider as TAmdClassProvider).useClass);
        }
    }
}


/**
 * Параметры директив модуля
 */
export interface TAmdModuleDirectiveOptions
{
    selector: string,
    factory: IDirectiveFactory|Array<any|IDirectiveFactory>,
}


/**
 * Параметры фильтров модуля
 */
export interface TAmdModuleFilterOptions
{
    name: string,
    factory: Injectable<Function>,
}

type TAmdModuleFilter = TAmdModuleFilterOptions | IPipeConstructor;
<!-- basicblock-end -->




#ign_ts
#ts

#telegram 

# /**
<!-- basicblock-start  deck='ign_ts' -->
/**::

 * Параметры декоратора модуля
 */
export interface TModuleDecoratorParams
{
    imports?: Array<IAmdModuleOptions | TAmdOldModuleOptions>,
    declarations?: TAmdModuleDeclaration[],
    // providers?: Array<any>,
    filters?: TAmdModuleFilter[],
    providers?: TAmdModuleProvider[],
    configurator?: Function,
    controller?: TAmdModuleController[],
    run?: Function
}

export type TAmdModuleController = {
    name: string,
    controller: Injectable<ng.IControllerConstructor>
} | { new(...args: any[]): IController, controller?: Injectable<IControllerConstructor> }

/**
 * Интерфейс модуля
 */
export interface IAmdModuleOptions
{
    moduleName?: string;
    module?: IModule;
    configure?: (params?: any) => IAmdModuleOptions


    new(...args: any[]): any;
}

export interface TAmdValueProvider
{
    provide: string;

    useValue: any;
}

export interface TAmdClassProvider
{
    provide: string;
    useClass: { new(...args: any[]): any } | Function;
}

export interface TAmdConstructorProvider extends Partial<TAmdClassProvider>{
    new(...args: any[]): any;
}

export declare type TAmdModuleProvider = TAmdValueProvider | TAmdClassProvider | TAmdConstructorProvider;
export declare type TAmdModuleDeclaration = IAmdComponentOptions | TAmdModuleDirectiveOptions;


/**
 * Тип для объявления модулей созданых без декоратора
 * {moduleName: 'ngMaterial'}
 */
export interface TAmdOldModuleOptions
{
    moduleName: string
}
<!-- basicblock-end -->



