/**
 * @jest-environment jsdom
 */
import React from 'react';
import * as rt from 'react/jsx-runtime';
import * as rtDEV from 'react/jsx-dev-runtime';
import { render } from '@testing-library/react';
import { registerAllReact } from '../dist';

describe('mixed directives', () => {

    beforeAll(() => {
        registerAllReact(React, rt, rtDEV);
    });

    test('hoc with element', () => {
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
                <div className="target" $hoc={Hoc} $label="Some label">
                    <input className="child"/>
                </div>
            </div>,
        );

        expect(container.querySelector('.target')).toBeTruthy();
        expect(container.querySelector('.child')).toBeTruthy();
        expect(container.querySelector('.message')).toBeTruthy();
        expect(container.querySelector('.label-text')).toBeTruthy();
    });
});
