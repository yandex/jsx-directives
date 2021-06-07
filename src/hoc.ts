import { registerHocDirective } from './core';

export type HocType = Function | Function[];

declare module 'react' {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        $hoc?: HocType;
    }

    interface Attributes {
        $hoc?: HocType;
    }
}

registerHocDirective('$hoc', (Factory: Function, props: any) => {
    if (props && 'function' === typeof props.$hoc) {
        const Hoc = props.$hoc;
        return Hoc(Factory);
    } else if (props.$hoc instanceof Array) {
        return (props.$hoc || []).reduce((acc, it) => it(acc), Factory);
    } else {
        console.error(`Unexpected arguments on $hoc`, props.$hoc);
        return Factory;
    }
});
