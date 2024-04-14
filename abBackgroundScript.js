// ==UserScript==
// @name         AB站网页背景更改
// @namespace    SakuraBackgroundScript
// @description  AB站背景更改油猴脚本，支持交互式背景选择和存储。
// @icon         http://github.smiku.site/sakura.png
// @license      MIT
// @version      1.0.0.0
// @author       SakuraMikku
// @copyright    2023-2099, SakuraMikku
// @updateURL    https://github.com/wuxinTLH/abBackgroundScript/blob/main/abBackgroundScript.js
// @QQgroup      793513923
// @QQgroup      https://jq.qq.com/?_wv=1027&k=0ewDiWw1
// @grant        GM_xmlhttpRequest
// @bilibili     https://space.bilibili.com/29058270
// @github       https://github.com/wuxintlh/
// @githubBoke   https://wuxintlh.github.io
// @acfun        https://www.acfun.cn/u/57391284
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        *www.bilibili.com/*
// @match        *://*.bilibili.com/*
// @match        *message.bilibili.com/*
// @match        *t.bilibili.com/*
// @match        *manga.bilibili.com/*
// @match        *live.bilibili.com/blackboard/*
// @match        *www.bilibili.com/page-proxy/*
// @match        *www.acfun.cn/*
// @match        *.acfun.cn/*
// @exclude      *live.bilibili.com/p/html/live-lottery/*
// @exclude      *message.bilibili.com/pages/nav/index_new_pc_sync*
// @exclude      *t.bilibili.com/pages/nav/index_new*
// @exclude      *member.bilibili.com/x2/creative/*
// @exclude      *member.bilibili.com/video/*
// @exclude      *ink.bilibili.com/p/center/course/index.html*
// @exclude      *www.bilibili.com/v/pay/charge*
// @exclude      *message.acfun.cn/*
// @exclude      *www.bilibili.com/bangumi*
// @exclude      *account.bilibili.com/account/*
// @exclude      *cm.bilibili.com/quests/*
// @exclude      *member.bilibili.com/platform*
// @exclude      *pay.bilibili.com/pay-v2-web*
// ==/UserScript==

"use strict";

window.onload = () => {
    firstTimeInfoAlert();
    init();
}
//#region 封装方法
/**
 * @name init
 * @description 脚本一些内容的初始化
 *
 */
function init() {
    //初始化脚本更改盒子


    //初始化盒子中的脚本


    //初始化背景

}



/**
 * @name firstTimeInfoAlert
 * @description 第一次进入提示
 */
function firstTimeInfoAlert() {
    let firstTime = localStorage.getItem("SakuraBackgroundScriptFirstTimeInfo");
    if (!firstTime) {
        //未提示过,则提示使用
        alert(`欢迎使用SakuraBackground脚本\n这是第一次使用脚本的提示\n以后不会再提醒`);
        localStorage.setItem("SakuraBackgroundScriptFirstTimeInfo", true);
    }
    //已经提示过,则不会再提示
}

/**
 * @name logSakuraBackgroundInfo
 * @description 输出日志
 * @param {*} type 
 * @param  {...any} obj 
 * @return noreturn
 */
function logSakuraBackgroundInfo(type, ...objs) {
    //设置日志信息
    let date = new Date();
    let strs = `[SakuraBackgroundScript] ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    //将信息并入strs
    objs.forEach(element => {
        strs += ` ${element}`;
    });
    //输出日志
    console[type](strs);
}


//#endregion