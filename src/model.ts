import { registerPropsDirective } from './core';

export type ModelType = {
    value: unknown;
    onChange: (...args: unknown[]) => void;
};

declare module 'react' {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        'x-model'?: ModelType;
    }

    interface Attributes {
        'x-model'?: ModelType;
    }
}

registerPropsDirective('x-model', ({['x-model']: xModel, ...props}: any) => ({
    value: xModel.value,
    onChange: xModel.onChange,
    ...props,
}));
