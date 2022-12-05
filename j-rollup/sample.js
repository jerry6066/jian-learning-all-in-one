/*
 * @Author: Libo Jian
 * @Date: 2022-12-05 13:43:18
 * @LastEditors: Libo Jian
 * @LastEditTime: 2022-12-05 13:45:47
 * @FilePath: /jian-learning-all-in-one/j-rollup/sample.js
 * @Description: 
 * 这是一段示例代码，配合source.js使用
 * 包含最简单生成AST以及magic-string的使用
 * 读取源文件，分析AST，只保留使用到的变量，达到tree-shaking的效果
 * 
 * Copyright (c) 2022 by Libo Jian, All Rights Reserved. 
 */
const acorn = require('acorn');
const fs = require('fs');
const MagicString = require('magic-string');

const code = fs.readFileSync('./source.js', 'utf-8').toString();

const ast = acorn.parse(code, {
    locations: true,
    ranges: true,
    sourceType: 'module',
    ecmaVersion: 7
});
const m = new MagicString(code);

const declarations = {};
const statements = [];

// 分析声明部分
ast.body
    .filter(item => item.type === 'VariableDeclaration')
    .forEach(item => {
        declarations[item.declarations[0].id.name] = item;
    })

// 将调用和对应的声明保存
ast.body
    .filter(item => item.type !== 'VariableDeclaration')
    .forEach(item => {
        statements.push(declarations[item.expression.callee.name]);
        statements.push(item);
    })

// 生成shaking后的代码
const result = statements.map(item => m.snip(item.start, item.end).toString()).join('\n');

// 目前剩余问题
// 深层级调用 if (true) { a() }
// 模块化 import
// 块作用域 函数作用域

console.log(result);
