/*
 * @Author: Libo Jian
 * @Date: 2022-12-05 18:36:22
 * @LastEditors: Libo Jian
 * @LastEditTime: 2022-12-05 21:10:54
 * @FilePath: /jian-learning-all-in-one/j-rollup/walk.js
 * @Description: 
 * 节点遍历器
 * 
 * Copyright (c) 2022 by Libo Jian, All Rights Reserved. 
 */


function walk(ast, { enter, leave }) {
    visit(ast, null, enter, leave);
};

function visit(node, parent, enter, leave) {
    if (!node) { return }

    enter && enter.call(null, node, parent);

    // 对象遍历
    const children = Object.keys(node).filter(key => typeof node[key] === 'object');
    children.forEach(childKey => {
        const value = node[childKey];
        visit(value, node, enter, leave);
    });

    leave && leave(node, parent);
}

module.exports = walk;
