/*
 * @Author: Libo Jian
 * @Date: 2022-12-05 18:37:33
 * @LastEditors: Libo Jian
 * @LastEditTime: 2022-12-05 18:53:38
 * @FilePath: /jian-learning-all-in-one/j-rollup/__tests__/walk.spec.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Libo Jian, All Rights Reserved. 
 */

const walk = require('../walk');

describe('Test Walk Fn', () => {
    it('单节点', () => {
        const ast = {
            a: 1,
        }

        const enter = jest.fn();
        const leave = jest.fn();
        walk(ast, {enter, leave});

        let calls = enter.mock.calls;
        expect(calls.length).toEqual(1);
        expect(calls[0][0]).toEqual({a:1});

        calls = leave.mock.calls;
        expect(calls.length).toEqual(1);
        expect(calls[0][0]).toEqual({a:1});
    });

    it('数组节点', () => {
        const ast = {
            a: [
                {
                    b: 2
                }
            ],
        }

        const enter = jest.fn();
        const leave = jest.fn();
        walk(ast, {enter, leave});

        let calls = enter.mock.calls;
        expect(calls.length).toEqual(3);
        expect(calls[0][0]).toEqual({a:[{b:2}]});
        expect(calls[1][0]).toEqual([{b:2}]);
        expect(calls[2][0]).toEqual({b:2});

        // 注意，leave方法顺序相反
        calls = leave.mock.calls;
        expect(calls.length).toEqual(3);
        expect(calls[0][0]).toEqual({b:2});
        expect(calls[1][0]).toEqual([{b:2}]);
        expect(calls[2][0]).toEqual({a:[{b:2}]});
    });

    it('多个节点', () => {
        const ast = {
            a: {
                b: 1,
            },
            c: {
                d: 2
            }
        }

        const enter = jest.fn();
        const leave = jest.fn();
        walk(ast, {enter, leave});

        let calls = enter.mock.calls;
        expect(calls.length).toEqual(3);
        expect(calls[0][0]).toEqual({a:{b:1},c:{d:2}});
        expect(calls[1][0]).toEqual({b:1});
        expect(calls[2][0]).toEqual({d:2});

        calls = leave.mock.calls;
        expect(calls.length).toEqual(3);
        expect(calls[0][0]).toEqual({b:1});
        expect(calls[1][0]).toEqual({d:2});
        expect(calls[2][0]).toEqual({a:{b:1},c:{d:2}});
    })
})