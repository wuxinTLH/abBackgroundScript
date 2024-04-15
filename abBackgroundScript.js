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

//#region 全局数据存储
var backgroundURLS = [];

//#endregion

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
    //对ab站检测
    let isAB = window.location.host.includes("bilibili.com") ? 'bili' : 'acfun';
    //初始化脚本更改盒子
    let backgroundMainElement;
    //获取ab站的初始化节点
    if (isAB == 'bili') {
        if ($('#app')) {
            backgroundMainElement = $('#app');
        } else if ($('#main')) {
            backgroundMainElement = $('#main');
        } else {
            backgroundMainElement = $('body');
        }
    } else if (isAB == 'acfun') {
        backgroundMainElement = $('body');
    }
    //对盒子进行初始化
    let sakuraBackgroundBox = document.createElement('div');
    let showSakuraBackgroundBox = document.createElement('div');
    //初始化盒子的样式
    let sakuraBackgroundCssStyles = ``;

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
 * @name storageAPI
 * @description 封装存储API
 * @returns Function
 * @example
 * let storage = new storageAPI();
 * storage.xxx();
 * 
 */
function storageAPI() {
    //初始化变量信息
    //dbName为数据库名称,storeName为存储名称
    const dbName = 'backgroundURL';
    const storeName = 'SakuraBCUrl';
    let operationResult;
    //初始化indexedDB,用于测试浏览器是否支持indexedDB
    let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    if (!indexedDB) {
        //不支持indexedDB使用localStorage
        /**
         * @name addBackgroundURL
         * @description 用于存储背景url或base64
         * @param {string} url 
         * @returns JSON数据
         */
        const addBackgroundURL = function (url) {
            try {
                //获取url长度
                let urlLength = url.length;
                //如果长度大于剩余空间则直接返回空间不足
                let remainingSpace = 5 * 1024 * 1024 - new Blob([JSON.stringify(localStorage)]).size
                if (url.length > remainingSpace) {
                    throw new Error('localStorage剩余容量不够使其保存图片base64格式或图片地址');
                }
                //如果可以存下,则直接存储
                if (localStorage.setItem(storeName, url)) {
                    return {
                        "status": true,
                        "message": "保存成功"
                    };
                } else {
                    throw new Error('存储时存在错误,原因可能为剩余容量不够');
                }

            } catch (error) {
                logSakuraBackgroundInfo("error", error);
                return {
                    "status": false,
                    "message": "存储失败"
                };
            }
        }
        /**
         * @name getBackgroundURL
         * @description 获取背景url或base64 
         * @returns 背景url或base64
         */
        const getBackgroundURL = function () {
            //获取url
            let url = localStorage.getItem(storeName);
            return url;
        }
        /**
         * @name deleteBackgroundURL
         * @description 删除背景url或base64 
         * @returns JSON数据
         */
        const deleteBackgroundURL = function () {
            //删除url
            if (localStorage.removeItem(storeName)) {
                return {
                    "status": true,
                    "message": "删除成功"
                }
            } else {
                return {
                    "status": false,
                    "message": "删除失败"
                }
            }
        }
        return {
            addBackgroundURL: addBackgroundURL,
            getBackgroundURL: getBackgroundURL,
            deleteBackgroundURL: deleteBackgroundURL
        }

    } else {
        //支持则使用indexedDB
        let db;
        let request = indexedDB.open(dbName, 1);
        //监听事件
        //打开时报错
        request.onerror = function (event) {
            logSakuraBackgroundInfo("error", "indexedDB打开失败");
        };
        //打开时阻塞
        request.onblocked = function (event) {
            logSakuraBackgroundInfo("error", "indexedDB打开被阻止");
        };
        //打开时升级
        request.onupgradeneeded = function (event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                let objectStore = db.createObjectStore(storeName, { keyPath: "id" });
            }
        };
        //成功打开
        request.onsuccess = function (event) {
            db = event.target.result;
        };

        const addBackgroundURL = function (url) {
            //设置一个5MB大小的分片
            let chunkSize = 5 * 1024 * 1024;
            let chunks = [];
            //对chunks赋值
            for (let i = 0; i < url.length; i += chunkSize) {
                chunks.push(url.slice(i, i + chunkSize));
            }
            //调用deleteBackgroundURL删除所有分片
            this.deleteBackgroundURL();

            //创建事务
            let transaction = db.transaction([storeName], "readwrite");
            //获取objectStore
            let objectStore = transaction.objectStore(storeName);
            //遍历chunks,存入indexedDB中
            chunks.forEach(function (chunk, index) {
                objectStore.add({ id: index, data: chunk });
            });
            return {
                "status": true,
                "message": "保存成功"
            };

        }

        const getBackgroundURL = function () {
            //获取所有分片
            let transaction = db.transaction([storeName], "readonly");
            //获取objectStore
            let objectStore = transaction.objectStore(storeName);
            //获取所有分片
            let request = objectStore.getAll();
            //监听事件
            request.onsuccess = function (event) {
                //获取结果
                let result = event.target.result;
                let url = "";
                //遍历result,拼接url
                result.forEach(function (chunk) {
                    url += chunk.data;
                });
                //返回url
                return url;
            };
            //监听事件
            request.onerror = function (event) {
                logSakuraBackgroundInfo("error", "获取背景url或base64失败");
            };
        }

        const deleteBackgroundURL = function () {
            //创建事务
            let transaction = db.transaction([storeName], "readwrite");
            //获取objectStore
            let objectStore = transaction.objectStore(storeName);
            //删除所有分片
            objectStore.clear();
            //返回结果
            return {
                "status": true,
                "message": "删除成功"
            };
        }
        const closeIndexedDB = function () {
            if (db) {
                db.close();
            }
        }
        return {
            addBackgroundURL: addBackgroundURL,
            getBackgroundURL: getBackgroundURL,
            deleteBackgroundURL: deleteBackgroundURL,
            closeIndexedDB: closeIndexedDB
        }
    }
}

/**
 * @name logSakuraBackgroundInfo
 * @description 输出日志
 * @param {string} type 
 * @param  {...string} obj 
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