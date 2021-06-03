/**
 * @jest-environment jsdom
 */
import React from 'react';
import * as rt from 'react/jsx-runtime';
import * as rtDEV from 'react/jsx-dev-runtime';
import { render } from '@testing-library/react';
import { registerAllReact } from '../dist';

describe('directive $hide', () => {

    beforeAll(() => {
        registerAllReact(React, rt, rtDEV);
    });

    test('initial', () => {
        const { container } = render(
            <div>
                <div className="target" />
            </div>,
        );

        expect(container.querySelectorAll('.target').length).toBe(1);
    });

    test('equals to true', () => {
        const { container } = render(
            <div>
                <div className="target" $hide={true} />
            </div>,
        );

        expect(container.querySelectorAll('.target').length).toBe(0);
    });

    test('equals to false', () => {
        const { container } = render(
            <div>
                <div className="target" $hide={false} />
            </div>,
        );

        expect(container.querySelectorAll('.target').length).toBe(1);
    });
});
