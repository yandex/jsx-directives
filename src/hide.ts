import { registerElementDirective } from './core';

export type HideType = boolean;

declare module 'react' {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        'x-hide'?: HideType;
    }

    interface Attributes {
        'x-hide'?: HideType;
    }
}

registerElementDirective('x-hide', (element: any, props: any) => {
    if (props && Boolean(props['x-hide'])) {
        return null;
    } else {
        return element;
    }
});
