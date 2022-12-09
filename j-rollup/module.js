/*
 * @Author: Libo Jian
 * @Date: 2022-12-08 20:32:20
 * @LastEditors: Libo Jian
 * @LastEditTime: 2022-12-08 22:02:06
 * @FilePath: /jian-learning-all-in-one/j-rollup/module.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Libo Jian, All Rights Reserved. 
 */
const acorn = require('acorn');
const analyse = require('./analyse');
const MagicString = require('magic-string');


class Module {
    constructor({code}) {
        const ast = acorn.parse(code, {
            locations: true,
            ranges: true,
            sourceType: 'module',
            ecmaVersion: 7
        });
        this.ast = ast;
        this.code = new MagicString(code);
        this.analyse();
    }

    analyse() {
        this.imports = {};
        this.exports = {};
        this.definitions = {};
        this.ast.body.forEach(node => {
            if (node.type === 'ImportDeclaration') {
                node.specifiers.forEach(s => {
                    const localName = s.local && s.local.name;
                    const name = s.imported && s.imported.name || '';
                    const source = node.source.value;
                    this.imports[localName] = {
                        localName,
                        name,
                        source,
                    }
                })
            } else if (node.type === 'ExportNamedDeclaration') {
                node.declaration.declarations.forEach(d => {
                    const name = d.id.name;
                    this.exports[name] = {
                        localName: name,
                        node,
                        expression: node.declaration
                    }
                })
            } 
        })

        analyse(this.ast, this.code, this);
        this.ast.body.forEach(node => {
            if (node._defines) {
                Object.keys(node._defines).forEach(key => {
                    this.definitions[key] = node
                })
            }
        })

    }

    expandAllStatements() {
        const allStatements = [];
        this.ast.body.forEach(node => {
            if (node.type === 'ImportDeclaration') return;
            if (node.type === 'VariableDeclaration') return;
            const statements = this.expandStatement(node);
            allStatements.push(...statements);
        })

        return allStatements;
    }

    // 语句扩展 声明 + 调用
    // 输入调用的 补上声明的
    expandStatement(statement) {
        const result = [];
        const _dependsOn = statement._dependsOn;
        Object.keys(_dependsOn).forEach(key => {
            result.push(this.define(key));
        })
        result.push(statement);
        return result;
    }

    /**
     * 查找变量声明
     * @param {*} name 
     */
    define(name) {
        if (false) {
            // import声明
        } else {
            // 该模块内
            return this.definitions[name];
        }
    }
}

module.exports = Module;