/*
 * @Author: Libo Jian
 * @Date: 2022-12-05 22:22:12
 * @LastEditors: Libo Jian
 * @LastEditTime: 2022-12-05 22:43:30
 * @FilePath: /jian-learning-all-in-one/j-rollup/__tests__/analyse.spec.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Libo Jian, All Rights Reserved. 
 */
const analyse = require('../analyse');
const acorn = require('acorn');
const MagicString = require('magic-string');


function getCode(code) {
    return {
        ast: acorn.parse(code, {
            locations: true,
            ranges: true,
            sourceType: 'module',
            ecmaVersion: 7
        }),
        magicString: new MagicString(code),
    }
}

describe('Test analyse', () => {
    it('_scope _defines', () => {
        const { ast, magicString } = getCode('const a = 1;')
        analyse(ast, magicString);
        expect(ast._scope.contains('a')).toEqual(true);
        expect(ast._scope.findDefiningScope('a')).toEqual(ast._scope);
        expect(ast.body[0]._defines).toEqual({ a: true });
    });

    describe('_dependsOn', () => {
        it('单语句', () => {
            const { ast, magicString } = getCode('const a = 1;')
            analyse(ast, magicString);
            expect(ast.body[0]._dependsOn).toEqual({ a: true });
        });

        it('多语句', () => {
            const { ast, magicString } = getCode('const a = 1; function f(){ const b = 2; };')
            analyse(ast, magicString);
            expect(ast.body[0]._dependsOn).toEqual({ a: true });
            expect(ast.body[1]._dependsOn).toEqual({ f: true, b: true });
        });
    })

    
})