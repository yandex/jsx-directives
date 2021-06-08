/**
 * @jest-environment jsdom
 */
import React from 'react';
import * as rt from 'react/jsx-runtime';
import * as rtDEV from 'react/jsx-dev-runtime';
import { render } from '@testing-library/react';
import { registerAllReact } from '../dist';

describe('directive x-hoc', () => {

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
                <input className="target" x-hoc={Hoc} />
            </div>,
        );

        expect(container.querySelector('.target')).toBeTruthy();
        expect(container.querySelector('.message')).toBeTruthy();
    });

    test('two hocs', () => {
        function Hoc1 (Create) {
            return ({children, ...props}) => {
                return (
                    <>
                        <span className="message">Message 1</span>
                        <Create {...props}>
                            {children}
                        </Create>
                    </>
                );
            }
        }
        function Hoc2 (Create) {
            return ({children, ...props}) => {
                return (
                    <>
                        <span className="message">Message 2</span>
                        <Create {...props}>
                            {children}
                        </Create>
                    </>
                );
            }
        }

        const { container } = render(
            <div>
                <input className="target" x-hoc={[Hoc1, Hoc2]} />
            </div>,
        );

        expect(container.querySelector('.target')).toBeTruthy();
        expect(container.querySelectorAll('.message').length).toBe(2);
        expect(container.querySelectorAll('.message')[0].innerHTML).toBe("Message 2");
        expect(container.querySelectorAll('.message')[1].innerHTML).toBe("Message 1");
    });
});
