/**
 * @jest-environment jsdom
 */
import React from 'react';
import * as rt from 'react/jsx-runtime';
import * as rtDEV from 'react/jsx-dev-runtime';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { registerAllReact } from '../dist';

describe('directive x-model', () => {

    beforeAll(() => {
        registerAllReact(React, rt, rtDEV);
    });

    test('initial', () => {
        const model = {
            value: "value text",
            onChange: jest.fn(),
        };
        const { container } = render(
            <div>
                <input className="target" x-model={model} />
            </div>,
        );

        const target = container.querySelector('.target');
        expect(target.value).toBe(model.value);

        expect(model.onChange).toHaveBeenCalledTimes(0);
        userEvent.type(target, "!");
        expect(model.onChange).toHaveBeenCalledTimes(1);
    });
});
