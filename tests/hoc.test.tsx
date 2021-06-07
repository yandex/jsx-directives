/**
 * @jest-environment jsdom
 */
import React from 'react';
import * as rt from 'react/jsx-runtime';
import * as rtDEV from 'react/jsx-dev-runtime';
import { render } from '@testing-library/react';
import { registerAllReact } from '../dist';

describe('directive $hoc', () => {

    beforeAll(() => {
        registerAllReact(React, rt, rtDEV);
    });

    test('simple hoc', () => {
        function Hoc (Create) {
            return ({children, ...props}) => {
                return (
                    <>
                        <span className="message">Some message</span>
                        <Create {...props}>
                            {children}
                        </Create>
                    </>
                );
            }
        }

        const { container } = render(
            <div>
                <input className="target" $hoc={Hoc} />
            </div>,
        );

        expect(container.querySelector('.target')).toBeTruthy();
        expect(container.querySelector('.message')).toBeTruthy();
    });
});
