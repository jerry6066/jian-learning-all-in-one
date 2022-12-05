/*
 * @Author: Libo Jian
 * @Date: 2022-12-05 21:56:18
 * @LastEditors: Libo Jian
 * @LastEditTime: 2022-12-05 22:07:54
 * @FilePath: /jian-learning-all-in-one/j-rollup/__tests__/scope.spec.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Libo Jian, All Rights Reserved. 
 */
const Scope = require('../scope');

describe('测试 Scope', () => {
    it('简单父子关系', () => {
        const root = new Scope({});
        root.add('a');
        const child = new Scope({
            parent: root
        });
        child.add('b');
        expect(child.contains('a')).toEqual(true);
        expect(child.contains('b')).toEqual(true);
        expect(child.findDefiningScope('a')).toEqual(root);
        expect(child.findDefiningScope('b')).toEqual(child);
    })
});