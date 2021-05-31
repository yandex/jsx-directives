import { registerElementDirective } from './core';

export type ShowType = boolean;

declare module 'react' {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        $show?: ShowType;
    }

    interface Attributes {
        $show?: ShowType;
    }
}

registerElementDirective('$show', (element: any, props: any) => {
    if (props && Boolean(props.$show)) {
        return element;
    } else {
        return null;
    }
});
