/*
 * @Author: Libo Jian
 * @Date: 2022-12-05 21:56:09
 * @LastEditors: Libo Jian
 * @LastEditTime: 2022-12-05 22:40:23
 * @FilePath: /jian-learning-all-in-one/j-rollup/scope.js
 * @Description: 
 * 作用域类
 * 
 * Copyright (c) 2022 by Libo Jian, All Rights Reserved. 
 */
class Scope {
    constructor(options = {}) {
        this.parent = options.parent;
        this.names = options.names;
    }

    /**
     * 变量名称加入到作用域里
     * @param {*} name 
     */
    add(name) {
        if (this.names) {
            this.names.push(name);
        } else {
            this.names = [name];
        }
    }

    /**
     * 判断是否被声明
     * @param {*} name
     * @return 是否被声明
     */
    contains(name) {
        return !!this.findDefiningScope(name);
    }

    /**
     * 返回变量所在的作用域
     * @param {*} name 
     * @return 变量所在的作用域
     */
    findDefiningScope(name) {
        if (this.names.includes(name)) {
            return this;
        } else if (this.parent) {
            return this.parent.findDefiningScope(name);
        } else {
            return null;
        }
    }
};

module.exports = Scope;