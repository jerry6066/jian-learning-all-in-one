/*
 * @Author: Libo Jian
 * @Date: 2022-12-08 20:32:13
 * @LastEditors: Libo Jian
 * @LastEditTime: 2022-12-09 13:32:57
 * @FilePath: /jian-learning-all-in-one/j-rollup/__tests__/module.spec.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Libo Jian, All Rights Reserved. 
 */
const Module = require('../module');


describe('测试 Module', () => {
    describe('测试 Import', () => {
        it('import', () => {
            const code = 'import a from "../module"';
            const module = new Module({
                code,
            });
            expect(module.imports).toEqual({
                a: {
                    localName: 'a',
                    name: '',
                    source: '../module'
                }
            })
        })
        it('import as', () => {
            const code = 'import { a as b } from "../module"';
            const module = new Module({
                code,
            });
            expect(module.imports).toEqual({
                b: {
                    localName: 'b',
                    name: 'a',
                    source: '../module'
                }
            })
        })
    });

    describe('测试 Exports', () => {
        it ('export', () => {
            const code = 'export var a = 1;';
            const module = new Module({ code });
            expect(module.exports['a'].localName).toEqual('a');
            expect(module.exports['a'].node).toEqual(module.ast.body[0]);
            expect(module.exports['a'].expression).toEqual(module.ast.body[0].declaration);
        });
    })

    describe('definiton', () => {
        it('definition', () => {
            const code = `const a = 1; const b = 1;`
            const module = new Module({ code });
            expect(module.definitions).toEqual({
                a: module.ast.body[0],
                b: module.ast.body[1],
            })
        })
    })

    describe('expandAllStatements', () => {
        it('', () => {
            const code = `const a = () => 1; const b = () => 1; a();`;
            const module = new Module({ code });
            const statements = module.expandAllStatements();
            expect(statements.length).toEqual(2);

            expect(module.code.snip(statements[0].start, statements[0].end).toString()).toEqual('const a = () => 1;')
            expect(module.code.snip(statements[1].start, statements[1].end).toString()).toEqual('a();')
        })
    })

    // describe('作业', () => {
    //     it('', () => {
    //         const code = `const a = () => 1; const b = () => 1; a();a();console.log(1)`;
    //         const module = new Module({ code });
    //         const statements = module.expandAllStatements();
            

    //         statements.forEach(item => {
    //             console.log(module.code.snip(item.start, item.end).toString());
    //         })  
            
    //         expect(statements.length).toEqual(2);

    //         // 应该输出 const a = () => 1; a();a();console.log(1);
    //         expect(module.code.snip(statements[0].start, statements[0].end).toString()).toEqual('const a = () => 1;')
    //         expect(module.code.snip(statements[1].start, statements[1].end).toString()).toEqual('a();')
    //     })
    // })
})