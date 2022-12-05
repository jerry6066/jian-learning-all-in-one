/*
 * @Author: Libo Jian
 * @Date: 2022-12-05 22:17:51
 * @LastEditors: Libo Jian
 * @LastEditTime: 2022-12-05 22:47:11
 * @FilePath: /jian-learning-all-in-one/j-rollup/analyse.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Libo Jian, All Rights Reserved. 
 */

const walk = require("./walk");
const Scope = require("./scope");

/**
 * 
 * @param {*} ast 
 * @param {*} magicString 
 * @param {*} module 
 */
function analyse(ast, magicString, module) {
    // 创建全局作用域
    let scope = new Scope();

    ast.body.forEach(statement => {

        /**
         * 给作用域添加变量
         * @param {*} declaration 声明节点
         */
        function addToScope(declaration) {
            const name = declaration.id.name;
            scope.add(name);
            if (!scope.parent) {
                statement._defines[name] = true;
            }
        }

        Object.defineProperties(statement, {
            _defines: { value: {} },
            _dependsOn: { value: {} }
        })

        walk(statement, {
            enter(node) {
                let newScope;
                switch(node.type) {
                    // 函数声明
                    case 'FunctionDeclaration':
                        // 加入到作用域
                        addToScope(node);
                        // 创建新的作用域
                        const params = node.params.map(v => v.name);
                        newScope = new Scope({
                            parent: scope,
                            params,
                        });

                        break;
                    // 变量声明
                    case 'VariableDeclaration':
                        node.declarations.forEach(addToScope);
                        break;
                    default:
                        break;
                }
                if (newScope) {
                    Object.defineProperties(node, {
                        _scope: { value: newScope }
                    })
                    scope = newScope;
                }
            },
            leave(node) {
                // 如果当前节点有作用域，leave时退出作用域
                if (node._scope) {
                    scope = scope.parent;
                }
            }
        })
    })

    ast._scope = scope;

    ast.body.forEach(statement => {
        walk(statement, {
            enter(node) {
                if (node.type === 'Identifier') {
                    statement._dependsOn[node.name] = true;
                }
            }
        })
    })
};

module.exports = analyse;