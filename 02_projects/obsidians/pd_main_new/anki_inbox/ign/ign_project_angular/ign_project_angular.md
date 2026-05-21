
#ign_project_angular
#project_angular

#telegram 

# - **`TAmdModuleDirectiveOptions`**: Интерфейс, описывающий параметры директивы модуля.
<!-- basicblock-start  deck='ign_project_angular' -->
- **`TAmdModuleDirectiveOptions`**: Интерфейс, описывающий параметры директивы модуля.::

- **`TAmdModuleFilterOptions`**: Интерфейс, описывающий параметры фильтра модуля.
- **`TModuleDecoratorParams`**: Интерфейс, описывающий параметры декоратора модуля.
- **`TAmdModuleController`**: Тип, описывающий контроллер модуля.
- **`IAmdModuleOptions`**: Интерфейс, описывающий опции модуля.
- **`TAmdValueProvider`, `TAmdClassProvider`, `TAmdConstructorProvider`, `TAmdModuleProvider`**: Интерфейсы и типы, описы
<!-- basicblock-end -->




#ign_project_angular
#project_angular

#telegram 

# ```
<!-- basicblock-start  deck='ign_project_angular' -->
```::

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

```

#### Описание функции `loadModuleDeclarations`

Эта функция добавляет компоненты и директивы в модуль AngularJS.

- **`module`**: AngularJS модуль, в который добавляются компоненты и директивы.
- **`declarations`**: Массив объектов, описывающих компоненты или директивы (`TAmdModuleDeclaration[]`).
- **Метод `map`**: Пробегает по всем элементам массива `declarations`.
  - **Проверка на `factory`**: Если объект имеет свойство `factory`, считается, что это директива, и регистрируется с помощью метода `module.directive`.
  - **Иначе**: Если свойства `factory` нет, считается, что это компонент, и он регистрируется с помощью метода `module.component`.

### 5. Загрузка фильтров

```

function loadModuleFilters(module: IModule, filters: TAmdModuleFilter[])
{
    filters.map((v) =>
    {
        if ('factory' in v) {
            module.filter(v.name, v.factory)
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

```

#### Описание функции `loadModuleFilters`

Эта функция добавляет фильтры в модуль AngularJS.

- **`module`**: AngularJS модуль, в который добавляются фильтры.
- **`filters`**: Массив фильтров (`TAmdModuleFilter[]`), которые нужно добавить в модуль.
- **Метод `map`**: Для каждого фильтра проверяет, есть ли у него свойство `factory`.
  - **Если есть `factory`**: Считается, что это функция-фабрика, и она регистрируется с помощью метода `module.filter`.
  - **Иначе**: Создается фабрика `factory` для класса фильтра (`IPipeConstructor`), которая инстанцирует объект фильтра и возвращает привязанный метод `transform`.

### 6. Загрузка сервисов

```

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

```

#### Описание функции `loadModuleProviders`

Эта функция добавляет провайдеры в модуль AngularJS.

- **`module`**: AngularJS модуль, в который добавляются провайдеры.
- **`providers`**: Массив провайдеров (`TAmdModuleProvider[]`), которые нужно добавить в модуль.
- **Метод `for`**: Проходит по каждому провайдеру и регистрирует его в модуле.
  - **Проверка на `provide`**: Если свойство `provide` отсутствует, выводится ошибка в консоль.
  - **Проверка на `useValue`**: Если есть свойство `useValue`, регистрируется значение провайдера с помощью `module.value`.
  - **Проверка на `useClass`**: Если есть свойство `useClass`, регистрируется класс провайдера с помощью `module.service`.

### 7. Определение интерфейсов и типов

Код также включает в себя несколько интерфейсов и типов, которые используются для типизации параметров и описания сущностей AngularJS.
<!-- basicblock-end -->




#ign_project_angular
#project_angular

#telegram 

# Этот код на TypeScript определяет систему декораторов для создания и управления модулями в AngularJS. Давайте разберем его подробно, шаг за шагом.
<!-- basicblock-start  deck='ign_project_angular' -->
Этот код на TypeScript определяет систему декораторов для создания и управления модулями в AngularJS. Давайте разберем его подробно, шаг за шагом.::


### Общий обзор

Код предоставляет функциональность для декорирования модулей, компонентов, директив, контроллеров, фильтров и сервисов в AngularJS с использованием TypeScript. Декоратор `@Module` и вспомогательные функции (`loadModuleControllers`, `loadModuleDeclarations`, `loadModuleFilters`, `loadModuleProviders`) позволяют создавать модуль AngularJS и загружать в него различные сущности (контроллеры, компоненты, фильтры, сервисы) на основе параметров.

### 1. Импорт зависимостей

```

import * as angular from "angular";
import {IController, IControllerConstructor, IDirectiveFactory, IModule, Injectable} from "angular";
import {IAmdComponentOptions} from "./component.decorator";
import lodash = require("../../../vendor/lodash/lodash");
import {IPipeConstructor} from "./pipe.decorator";

```

- **angular**: Импортируется AngularJS для работы с его API.
- **lodash**: Импортируется библиотека lodash, которая предоставляет утилиты для работы с объектами и массивами. В данном случае используется для приведения строк к camelCase.
- **IAmdComponentOptions** и **IPipeConstructor**: Импортируются интерфейсы, которые, вероятно, описывают опции компонентов и конструкторы фильтров.

### 2. Декоратор модуля

```

export function Module(params: TModuleDecoratorParams)
{
    return <T extends IAmdModuleOptions>(constructor: T) =>
    {
        const moduleName = lodash.camelCase(constructor.name);
        const requires   = (params.imports || []).map(v => v.moduleName);
        const module     = angular.module(moduleName, requires);

        loadModuleControllers(module, params.controller || []);
        loadModuleDeclarations(module, params.declarations || []);
        loadModuleFilters(module, params.filters || []);
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

```

#### Описание функции `Module`

Функция `Module` — это декоратор, который принимает параметры типа `TModuleDecoratorParams` и возвращает функцию, которая принимает конструктор модуля и модифицирует его.

- **`moduleName`**: Преобразует имя конструктора модуля в `camelCase` (например, `MyModule` -> `myModule`).
- **`requires`**: Массив зависимостей модуля, создается на основе параметра `imports`. Для каждого элемента в `imports` берется свойство `moduleName`.
- **`module`**: Создание нового модуля AngularJS с именем `moduleName` и зависимостями `requires`.

Далее, загружаются контроллеры, директивы/компоненты, фильтры и провайдеры с помощью вспомогательных функций (`loadModuleControllers`, `loadModuleDeclarations`, `loadModuleFilters`, `loadModuleProviders`).

- **`params.configurator` и `params.run`**: Если указаны, используются для конфигурирования и запуска модуля через AngularJS API `config` и `run`.
- **`constructor.moduleName` и `constructor.module`**: Добавление свойств `moduleName` и `module` в конструктор, чтобы они были доступны для использования в других частях приложения.

### 3. Загрузка контроллеров

```

function loadModuleControllers(module: IModule, declarations: TAmdModuleController[]) {
    declarations.forEach((v) => {
        module.controller(v.name, v.controller);
    });
}

```

#### Описание функции `loadModuleControllers`

Эта функция добавляет контроллеры в модуль AngularJS.

- **`module`**: AngularJS модуль, в который добавляются контроллеры.
- **`declarations`**: Массив контроллеров (`TAmdModuleController[]`), которые нужно добавить в модуль.
- **Метод `forEach`**: Для каждого контроллера вызывается метод `module.controller`, который регистрирует контроллер в модуле AngularJS.

### 4. Загрузка компонентов и директив
<!-- basicblock-end -->




#ign_project_angular
#project_angular

#telegram 

# #module.decorator.ts
<!-- basicblock-start  deck='ign_project_angular' -->
#module.decorator.ts::


```

/**
 * Декораторы модулей
 * Документация
 * https://docs.google.com/document/d/1xefriIChFAEwAi2VqBhqawNPG75K9qWLWYA2p1IQfgk/edit
 */
import * as angular from "angular";
import {IController, IControllerConstructor, IDirectiveFactory, IModule, Injectable} from "angular";
import {IAmdComponentOptions} from "./component.decorator";
import lodash = require("../../../vendor/lodash/lodash");
import {IPipeConstructor} from "./pipe.decorator";


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
        const requires   = (params.imports || []).map(v => v.moduleName);
        const module     = angular.module(moduleName, requires);

        loadModuleControllers(module, params.controller || []);
        loadModuleDeclarations(module, params.declarations || []);
        loadModuleFilters(module, params.filters || []);
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
 * @param module
 * @param declarations
 */
function loadModuleControllers(module: IModule, declarations: TAmdModuleController[]) {
    declarations.forEach((v) => {
        module.controller(v.name, v.controller);
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
{
    filters.map((v) =>
    {
        if ('factory' in v) {
            module.filter(v.name, v.factory)
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




#ign_project_angular
#project_angular

#telegram 

# ```
<!-- basicblock-start  deck='ign_project_angular' -->
```::

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




#ign_project_angular
#project_angular

#telegram 

# #module.decorator.ts
<!-- basicblock-start  deck='ign_project_angular' -->
#module.decorator.ts::


/**
 * Декораторы модулей
 * Документация
 * https://docs.google.com/document/d/1xefriIChFAEwAi2VqBhqawNPG75K9qWLWYA2p1IQfgk/edit
 */
import * as angular from "angular";
import {IController, IControllerConstructor, IDirectiveFactory, IModule, Injectable} from "angular";
import {IAmdComponentOptions} from "./component.decorator";
import lodash = require("../../../vendor/lodash/lodash");
import {IPipeConstructor} from "./pipe.decorator";


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
        const requires   = (params.imports || []).map(v => v.moduleName);
        const module     = angular.module(moduleName, requires);

        loadModuleControllers(module, params.controller || []);
        loadModuleDeclarations(module, params.declarations || []);
        loadModuleFilters(module, params.filters || []);
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
 * @param module
 * @param declarations
 */
function loadModuleControllers(module: IModule, declarations: TAmdModuleController[]) {
    declarations.forEach((v) => {
        module.controller(v.name, v.controller);
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
{
    filters.map((v) =>
    {
        if ('factory' in v) {
            module.filter(v.name, v.factory)
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




#ign_project_angular
#project_angular

#telegram 

# /**
<!-- basicblock-start  deck='ign_project_angular' -->
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



