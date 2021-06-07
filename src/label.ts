import { registerElementDirective, CreateType } from './core';

export type LabelType = string;

declare module 'react' {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        $label?: LabelType;
    }

    interface Attributes {
        $label?: LabelType;
    }
}

registerElementDirective('$label', (element: any, props: any, type: any, children: any, create: CreateType) => {
    return create(
        'label',
        {},
        create('span', { className: 'label-text' }, `${props.$label}`),
        element
    );
});
