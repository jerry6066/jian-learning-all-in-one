/*
 * @Author: Libo Jian
 * @Date: 2022-12-05 21:14:18
 * @LastEditors: Libo Jian
 * @LastEditTime: 2022-12-05 21:15:52
 * @FilePath: /jian-learning-all-in-one/j-rollup/funcScope/source.js
 * @Description: 
 * 
 * Copyright (c) 2022 by Libo Jian, All Rights Reserved. 
 */
const a = 1;
function f1() {
    const b = 2;
    function f2() {
        const c = 3;
    }
    const d = 4;
}
const e = 5;