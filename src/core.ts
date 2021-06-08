import * as React from 'react';

export const PREFIX = 'x-';

const propsDirectives = new Map();
const elementDirectives = new Map();
const hocDirectives = new Map();

export type CreateType = typeof React.createElement;
export type CreateElementReturn = ReturnType<CreateType>;
export type CreateElementArgs = Parameters<CreateType>;
export type CreateElementType = CreateElementArgs[0];
export type CreateElementProps = CreateElementArgs[1];
export type CreateElementChildren = CreateElementArgs[2];

type PropsDirectiveHandler3Arg = (props: CreateElementProps, type: CreateElementType, children: CreateElementChildren) => CreateElementProps;
type PropsDirectiveHandler2Arg = (props: CreateElementProps, type: CreateElementType) => CreateElementProps;
type PropsDirectiveHandler1Arg = (props: CreateElementProps) => CreateElementProps;
export type PropsDirectiveHandler = PropsDirectiveHandler1Arg | PropsDirectiveHandler2Arg | PropsDirectiveHandler3Arg;

type ElementDirectiveHandler2Arg = (element: CreateElementReturn, props: CreateElementProps) => CreateElementReturn;
type ElementDirectiveHandler3Arg = (element: CreateElementReturn, props: CreateElementProps, type: CreateElementType) => CreateElementReturn;
type ElementDirectiveHandler4Arg = (element: CreateElementReturn, props: CreateElementProps, type: CreateElementType, children: CreateElementChildren) => CreateElementReturn;
type ElementDirectiveHandler5Arg = (element: CreateElementReturn, props: CreateElementProps, type: CreateElementType, children: CreateElementChildren, pragma: CreateType) => CreateElementReturn;
export type ElementDirectiveHandler = ElementDirectiveHandler2Arg | ElementDirectiveHandler3Arg | ElementDirectiveHandler4Arg | ElementDirectiveHandler5Arg;

type HocDirectiveHandler2Arg = (create: Function, props: CreateElementProps) => CreateElementReturn;
export type HocDirectiveHandler = HocDirectiveHandler2Arg;

export function extractDirectiveProps<T extends CreateElementProps, K extends keyof T = keyof T>(props: T) {
    if (!props) {
        return {
            pDirs: [],
            hDirs: [],
            eDirs: [],
            restProps: props,
        };
    }

    const pDirs: [K, T[K]][] = [];
    const hDirs: [K, T[K]][] = [];
    const eDirs: [K, T[K]][] = [];
    const restProps: Partial<T> = {};
    const propKeys = ('object' === typeof props ? Object.keys(props as object) : []) as K[];
    for (let i = 0; i < propKeys.length; i++) {
        const key: K = propKeys[i];
        const val = (props as any)[key] as T[K];
        if ((key as string).substr(0, PREFIX.length) === PREFIX) {
            if (propsDirectives.has(key)) {
                pDirs.push([key, val]);
            } else if (hocDirectives.has(key)) {
                hDirs.push([key, val]);
            } else if (elementDirectives.has(key)) {
                eDirs.push([key, val]);
            } else {
                console.warn(`Unregistered directive ${key}`);
            }
        } else {
            restProps[key] = val;
        }
    }
    return {
        pDirs: pDirs.sort(), // сортируем для устранения кроссбраузерной разницы порядка свойств объекта
        hDirs: hDirs.sort(),
        eDirs: eDirs.sort(),
        restProps,
    };
}

export function jsxPragmaBuilder(pragma: CreateType) {
    return function createElementPatch(this: typeof React, type: CreateElementType, props: CreateElementProps, ...children: CreateElementChildren[]): CreateElementReturn {
        if (typeof type !== 'function' && typeof type !== 'string') return pragma.call(this, type, props, ...children); // исключаем фрагменты, провайдеры и т.п.
        const originChildren = children;
        const { pDirs, hDirs, eDirs, restProps } = extractDirectiveProps(props);

        let newProps = restProps;
        if (props && pDirs.length > 0) {
            newProps = pDirs
                .reduce((acc, [key, val]) => {
                    return propsDirectives.get(key)({ [key]: val, ...acc }, type, children);
                }, newProps);
        }

        let Element = (props: any) => {
            return pragma(type, props, ...originChildren);
        }
        if (!newProps) return Element({});

        if (hDirs.length > 0) {
            Element = hDirs
                .reduce((el, [key, val]) => {
                    return hocDirectives.get(key)(el, { [key]: val, ...newProps });
                }, Element);
        }

        if (eDirs.length > 0) {
            return eDirs
                .reduce((acc, [key, val]) => {
                    return elementDirectives.get(key)(acc, { [key]: val, ...newProps }, type, children, pragma)
                }, Element(newProps));
        }

        return Element(newProps);
    };
}

export function registerPropsDirective (name: string, handler: PropsDirectiveHandler) {
    if (isRegistered(name)) {
        throw new Error(`Directive with name "${name}" is already registered`);
    }
    if (name.substr(0, PREFIX.length) !== PREFIX) {
        throw new Error(`Directive name should start with "${PREFIX}". Provided: "${name}"`);
    }
    propsDirectives.set(name, handler);
}

export function registerElementDirective (name: string, handler: ElementDirectiveHandler) {
    if (isRegistered(name)) {
        throw new Error(`Directive with name "${name}" is already registered`);
    }
    if (name.substr(0, PREFIX.length) !== PREFIX) {
        throw new Error(`Directive name should start with "${PREFIX}". Provided: "${name}"`);
    }
    elementDirectives.set(name, handler);
}

export function registerHocDirective (name: string, handler: HocDirectiveHandler) {
    if (isRegistered(name)) {
        throw new Error(`Directive with name "${name}" is already registered`);
    }
    if (name.substr(0, PREFIX.length) !== PREFIX) {
        throw new Error(`Directive name should start with "${PREFIX}". Provided: "${name}"`);
    }
    hocDirectives.set(name, handler);
}

export function unregister(name: string) {
    if (propsDirectives.has(name)) {
        propsDirectives.delete(name);
    } else if (elementDirectives.has(name)) {
        elementDirectives.delete(name);
    } else if (hocDirectives.has(name)) {
        hocDirectives.delete(name);
    } else {
        throw new Error(`Directive with name "${name}" is not registered yet`);
    }
}

export function isRegistered(name: string) {
    return propsDirectives.has(name) || elementDirectives.has(name) || hocDirectives.has(name);
}

export function registerPragma(object: any, property: string) {
    object[property] = jsxPragmaBuilder(object[property]);
}

let isRegisterReactCalled = false;
export function registerReact(React: any) {
    if (isRegisterReactCalled) return;
    isRegisterReactCalled = true;

    registerPragma(React, 'createElement');
}

let isRegisterJsxRuntimeCalled = false;
export function registerJsxRuntime(rt: any) {
    if (isRegisterJsxRuntimeCalled) return;
    isRegisterJsxRuntimeCalled = true;

    registerPragma(rt, 'jsx');
    registerPragma(rt, 'jsxs');
}

let isRegisterJsxDevRuntimeCalled = false;
export function registerJsxDevRuntime(rtDev: any) {
    if (isRegisterJsxDevRuntimeCalled) return;
    isRegisterJsxDevRuntimeCalled = true;

    registerPragma(rtDev, 'jsxDEV');
    registerPragma(rtDev, 'jsxsDEV');
}

export function registerAllReact (react: any, reactRuntime: any, reactDevRuntime: any) {
    registerReact(react);
    registerJsxRuntime(reactRuntime);
    registerJsxDevRuntime(reactDevRuntime);
}

export function registerAllReactAutodetect () {
    registerReact(require('react'));
    registerJsxRuntime(require('react/jsx-runtime'));
    registerJsxDevRuntime(require('react/jsx-dev-runtime'));
}
