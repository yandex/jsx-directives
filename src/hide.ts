import { registerElementDirective } from './core';

export type HideType = boolean;

declare module 'react' {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        $hide?: HideType;
    }

    interface Attributes {
        $hide?: HideType;
    }
}

registerElementDirective('$hide', (element: any, props: any) => {
    if (props && Boolean(props.$hide)) {
        return null;
    } else {
        return element;
    }
});
