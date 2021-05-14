# jsx-directives

Директивы для JSX (React, Preact, др.) по аналогии с директивами Vue и Angular

Для того, чтобы директивы заработали для приложения на React, нужно подключить их следующим образом:
```tsx
// Импортируем сам пакет директив
import { registerAllReact } from 'jsx-directives';

// Импортируем актуальные версии реакта и jsx-рантайма
import React from 'react';
import * as rt from 'react/jsx-runtime';
import * as rtDEV from 'react/jsx-dev-runtime';

// Связываем директивы и актуальный реакт
registerAllReact(React, rt, rtDEV);
```

Пример использования для React:
```tsx
import React, { FC, useCallback, useState } from 'react';

export const SomeComponent: FC = () => {
  const [val, setVal] = useState('');
  const model = {
    value: val,
    onChange: useCallback((e: any) => {
      setVal(e.target.value);
    }, []),
  };
  return (
    <div>
      <input $model={model} />
      <div>{model.value}</div>
      <div $visible={model.value !== 'hide'}>Type "hide" and this message will be removed from DOM</div>
    </div>
  );
};
```

Пример создания директивы, модифицирующей пропсы:
```typescript
import { registerPropsDirective } from '@yandex-market/react-directives';

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
```

Пример создания директивы, модифицирующей элемент:
```typescript
import { registerPropsDirective } from '@yandex-market/react-directives';

declare module 'react' {
    interface HTMLAttributes<T> extends DOMAttributes<T> {
        $visible?: boolean;
    }

    interface Attributes {
        $visible?: boolean;
    }
}

registerElementDirective('$visible', (element: any, props: any) => {
    if (props && props.$visible === false) {
        return null;
    } else {
        return element;
    }
});
```