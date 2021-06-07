/**
 * @jest-environment jsdom
 */
import React from 'react';
import * as rt from 'react/jsx-runtime';
import * as rtDEV from 'react/jsx-dev-runtime';
import { render } from '@testing-library/react';
import { registerAllReact } from '../dist';

describe('directive $label', () => {

    beforeAll(() => {
        registerAllReact(React, rt, rtDEV);
    });

    test('simple label', () => {
        const { container } = render(
            <div>
                <input className="target" $label="Some label text" />
            </div>,
        );

        expect(container.querySelector('label .label-text').innerHTML).toBe('Some label text');
    });
});
