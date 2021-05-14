import * as React from 'react';

const createElement = React.createElement;
export const PREFIX = '$';

const propsDirectives = new Map();
const elementDirectives = new Map();
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

(React as any).createElement = function createElementPatch(this: typeof React, type: CreateElementType, props: CreateElementProps, ...children: CreateElementChildren[]): CreateElementReturn {
    const newProps = wrapProps(type, props, children);
    const element = createElement.call(this, type, newProps, ...children);
    if (!newProps || elementDirectives.size === 0) return element;

    return Object.keys(newProps)
        .filter(it => it.substr(0, PREFIX.length) === PREFIX && elementDirectives.has(it))
        .sort() // для устранения кроссбраузерной разницы порядка свойств объекта
        .reduce((acc, it) => elementDirectives.get(it)(acc, newProps, type, children), element);
} as typeof React.createElement;

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

export function unregister(name: string) {
    if (propsDirectives.has(name)) {
        propsDirectives.delete(name);
    } else if (elementDirectives.has(name)) {
        elementDirectives.delete(name);
    } else {
        throw new Error(`Directive with name "${name}" is not registered yet`);
    }
}

export function isRegistered(name: string) {
    return propsDirectives.has(name) || elementDirectives.has(name);
}
