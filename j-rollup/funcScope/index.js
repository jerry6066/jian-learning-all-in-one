/*
 * @Author: Libo Jian
 * @Date: 2022-12-05 21:14:13
 * @LastEditors: Libo Jian
 * @LastEditTime: 2022-12-05 21:54:06
 * @FilePath: /jian-learning-all-in-one/j-rollup/funcScope/index.js
 * @Description: 
 * 利用walk文件 检查函数作用域
 * 
 * Copyright (c) 2022 by Libo Jian, All Rights Reserved. 
 */

const acorn = require('acorn');
const fs = require('fs');
const walk = require('../walk');

// 要cd到当前目录，否则路径有问题
const code = fs.readFileSync('./source.js', 'utf-8').toString();

const ast = acorn.parse(code, {
    locations: true,
    ranges: true,
    sourceType: 'module',
    ecmaVersion: 7
});

let indent = 0;

walk(ast.body, {
    enter(node) {
        if (node.type === 'VariableDeclarator') {
            console.log(' '.repeat(indent * 4), 'Var: ', node.id.name);
        } 
        if (node.type === 'FunctionDeclaration') {
            console.log(' '.repeat(indent * 4), 'Func: ', node.id.name);
            indent++;
        }
    },
    leave(node) {
        if (node.type === 'FunctionDeclaration') {
            indent--;
        }
    }
})

// 输出
// Var:  a
// Func:  f1
//     Var:  b
//     Func:  f2
//         Var:  c
//     Var:  d
// Var:  e
 

