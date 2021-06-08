import { registerHocDirective } from './core';

export type HocType = Function | Function[];

declare module 'react' {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        'x-hoc'?: HocType;
    }

    interface Attributes {
        'x-hoc'?: HocType;
    }
}

registerHocDirective('x-hoc', (Factory: Function, props: any) => {
    if (props && 'function' === typeof props['x-hoc']) {
        const Hoc = props['x-hoc'];
        return Hoc(Factory);
    } else if (props['x-hoc'] instanceof Array) {
        return (props['x-hoc'] || []).reduce((acc: Function, it: Function) => it(acc), Factory);
    } else {
        console.error(`Unexpected arguments on x-hoc`, props['x-hoc']);
        return Factory;
    }
});
