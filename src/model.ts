import { registerPropsDirective } from './core';

export type ModelType = {
    value: unknown;
    onChange: (...args: unknown[]) => void;
};

declare module 'react' {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        $model?: ModelType;
    }

    interface Attributes {
        $model?: ModelType;
    }
}

registerPropsDirective('$model', ({$model, ...props}: any) => ({
    value: $model.value,
    onChange: $model.onChange,
    ...props,
}));
