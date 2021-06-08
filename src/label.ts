import { registerElementDirective, CreateType } from './core';

export type LabelType = string;

declare module 'react' {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        'x-label'?: LabelType;
    }

    interface Attributes {
        'x-label'?: LabelType;
    }
}

registerElementDirective('x-label', (element: any, props: any, type: any, children: any, create: CreateType) => {
    return create(
        'label',
        {},
        create('span', { className: 'label-text' }, `${props['x-label']}`),
        element
    );
});
