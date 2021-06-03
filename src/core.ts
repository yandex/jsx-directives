import * as React from 'react';

export const PREFIX = '$';

const propsDirectives = new Map();
const elementDirectives = new Map();
const hocDirectives = new Map();
function wrapProps(type: CreateElementType, props: CreateElementProps, children: CreateElementChildren[]): CreateElementProps {
    if (!props || propsDirectives.size === 0) return props;

    return Object.keys(props)
        .filter(it => it.substr(0, PREFIX.length) === PREFIX && propsDirectives.has(it))
        .sort() // для устранения кроссбраузерной разницы порядка свойств объекта
        .reduce((acc, it) => propsDirectives.get(it)(acc, type, children), props);
}

export type CreateElementReturn = ReturnType<typeof React.createElement>;
export type CreateElementArgs = Parameters<typeof React.createElement>;
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
export type ElementDirectiveHandler = ElementDirectiveHandler2Arg | ElementDirectiveHandler3Arg | ElementDirectiveHandler4Arg;

export function jsxPragmaBuilder(pragma: (...args: any[]) => any) {
    return function createElementPatch(this: typeof React, type: CreateElementType, props: CreateElementProps, ...children: CreateElementChildren[]): CreateElementReturn {
        const newProps = wrapProps(type, props, children);
        const element = pragma.call(this, type, newProps, ...children);
        if (!newProps || elementDirectives.size === 0) return element;

        return Object.keys(newProps)
            .filter(it => it.substr(0, PREFIX.length) === PREFIX && elementDirectives.has(it))
            .sort() // для устранения кроссбраузерной разницы порядка свойств объекта
            .reduce((acc, it) => elementDirectives.get(it)(acc, newProps, type, children), element);
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

export function registerHocDirective (name: string, handler: ElementDirectiveHandler) {
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
