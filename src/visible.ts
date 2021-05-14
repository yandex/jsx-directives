import { registerElementDirective } from './core';

export type VisibleType = boolean;

declare module 'react' {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        $visible?: VisibleType;
    }

    interface Attributes {
        $visible?: VisibleType;
    }
}

registerElementDirective('$visible', (element: any, props: any) => {
    if (props && props.$visible === false) {
        return null;
    } else {
        return element;
    }
});
