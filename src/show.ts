import { registerElementDirective } from './core';

export type ShowType = boolean;

declare module 'react' {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        'x-show'?: ShowType;
    }

    interface Attributes {
        'x-show'?: ShowType;
    }
}

registerElementDirective('x-show', (element: any, props: any) => {
    if (props && Boolean(props['x-show'])) {
        return element;
    } else {
        return null;
    }
});
