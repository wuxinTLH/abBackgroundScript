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
// @require      https://greasyfork.org/scripts/445358-ab%E7%AB%99%E8%83%8C%E6%99%AF%E6%9B%B4%E6%94%B9css/code/ab%E7%AB%99%E8%83%8C%E6%99%AF%E6%9B%B4%E6%94%B9css.js?version=1053244
// @require      https://update.greasyfork.org/scripts/483725/1305374/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%95%B0%E6%8D%AE%E5%BA%93API.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js
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
    init();

    //#region 封装方法
    function init() {
        //获取host,选择分支
        let abChosen, liveFlag, host = window.location.host;

        //判断ab站
        if (host.indexOf("bilibili") != -1) { //b站
            abChosen = "bili";
            //是否为直播
            if (host == "live.bilibili.com") { //是
                liveFlag = true;
            } else { //不是
                liveFlag = false;
            }
        } else if (host.indexOf("acfun") != -1) { //a站
            abChosen = "acfun";
            liveFlag = false
        }
        //default_background_urls考虑采用http请求一个接口来获取默认图片地址
        let default_background_urls = {
            'bili': [
                'https://i0.hdslb.com/bfs/article/d12fee446e2533206e0b04024c39e00a40c4bc4c.png@1320w_912h.webp',
                'https://i0.hdslb.com/bfs/article/54616fdbb9bed40ea2cf8540f8517b11c9aa4ad3.jpg@1320w_868h.webp',
                'https://img1.imgtp.com/2022/05/19/qqKLSTQo.png',
                'https://i0.hdslb.com/bfs/album/658ab52e2d631f9d974112e2d5b4cab476e3f61d.jpg',
                'https://i0.hdslb.com/bfs/vc/c255f51c594cf6e724fb9f04975fae7e7eb8b876.jpg@2000w_1e.webp',
                'https://w.wallhaven.cc/full/o3/wallhaven-o31p97.jpg'
            ],
            'acfun': [
                'https://w.wallhaven.cc/full/g8/wallhaven-g8kd37.jpg',
                'https://img.tt98.com/d/file/96kaifa/201905101622281/001.jpg',
                'https://img.tt98.com/d/file/tt98/2019092618001803/001.jpg',
                'https://w.wallhaven.cc/full/g7/wallhaven-g79ov3.jpg',
                'https://w.wallhaven.cc/full/rd/wallhaven-rdyyjm.png',
                'https://w.wallhaven.cc/full/o3/wallhaven-o31p97.jpg'
            ]
        }
        //初始化bckgroundBox
        setBackgroundBox(abChosen);
        //将backgroundBox进行vue绑定
        let BackgroundBoxVue = new Vue({
            el: '#sakuraBackgroundBox',
            data: {
                default_url: default_background_urls[abChosen],
            },
            methods: {
                displayChangeBox: function () {
                    let changeBox = $('.ChangeBox');
                    changeBox.css('display', changeBox.css('display') === 'none' ? 'block' : 'none');
                },
                defaultBackgroundChange: function (src) {

                },
                diyBackgroundChange: function () {
                    if ($("#diyInput").val() == "" || $("#diyInput").val() == null) {
                        alert("请不要输入空值");
                        return null;
                    } else {
                        //设置背景
                        let url = $("#diyInput").val();
                    }
                },
                diyBase64Change: function () {
                    let file = $("#base64Pic")[0].files[0];
                    let reader = new FileReader();
                    if (file) {
                        reader.readAsDataURL(file);
                        reader.onloadend = function () {
                            // console.log(reader.result);
                            setBackgroundImage(reader.result, ab_chosen);
                        }
                    } else {
                        alert("请上传一张图片");
                    }
                },
                deleteURL: function () {
                    if (confirm("确定要删除背景吗？")) {
                        //调用indexedDBAPI,删除URL或图片base64格式
                    }
                }
            }
        });
        //生成背景div
        setDivClassSakuraBackground(abChosen);
        //生成背景
        let bcurl = window.localStorage.getItem('bcurl');
        bcurl = bcurl && bcurl.trim() !== '' ? bcurl : '默认bcurl';
        setBackgroundImage(url, abChosen);
    }

    /**
     * @description 对ab站进行Box的创建
     * @param {String} abChosen 
     */
    function setBackgroundBox(abChosen) {
        let elBody = getElBody(abChosen);
        let father_node = $(elBody)[0];
        let background_box = document.createElement("div");
        father_node.appendChild(background_box);
        background_box.innerHTML = `
    <button class="clickButton" v-on:click="displayChangeBox()">更改背景</button>
    <div class="ChangeBox">
        <h4>更改背景</h4>
        <div class="defaultBox">
            <img :src="default_url[0]" alt="" class="defaultImage" v-on:click="defaultBackgroundChange(default_url[0])">
            <img :src="default_url[1]" alt="" class="defaultImage" v-on:click="defaultBackgroundChange(default_url[1])">
            <img :src="default_url[2]" alt="" class="defaultImage" v-on:click="defaultBackgroundChange(default_url[2])">
            <img :src="default_url[3]" alt="" class="defaultImage" v-on:click="defaultBackgroundChange(default_url[3])">
            <img :src="default_url[4]" alt="" class="defaultImage" v-on:click="defaultBackgroundChange(default_url[4])">
            <img :src="default_url[5]" alt="" class="defaultImage" v-on:click="defaultBackgroundChange(default_url[5])">
        </div>
        <div class="diyBox">
            <input type="text" name="" id="diyInput" placeholder="请输入背景URL">
            <button id="diySubmit" v-on:click="diyBackgroundChange()">点击修改</button>
            <input type="file" name="" id="base64Pic">
            <button id="diySubmit" v-on:click="diyBase64Change()">点击修改</button>
            <button id="diySubmit" v-on:click="deleteURL()">删除URL</button>
        </div>
    </div>
    `;
        background_box.id = "sakuraBackgroundBox";
        //console.log("sakuraBackgroundBox创建完毕");

        //根据elBody进行BackgroundBox的生成

        /*
        if (abChosen == "bili") {
            if (liveFlag) {
                //直播
            } else {
                //非直播
            }
        } else {
        }
        */
    }


    /**
     * @description 根据ab站获取对应的vue绑定Element
     * @param {String} abChosen 
     * @returns {String} elBody
     */
    function getElBody(abChosen) {
        let elBody;
        if (abChosen == "bili") {
            if ($("#app").length > 0) {
                elBody = "#app";
            } else {
                elBody = "body";
            }
        } else if (abChosen == "acfun") {
            if ($("#main").length > 0) {
                elBody = "#main";
            } else {
                elBody = "body";
            }
        }
        return elBody;
    }


    //主程序 设置背景
    /**
     * 
     * @param {String} url - 图片url或base64
     * @param {*} abChosen 
     */
    function setBackgroundImage(url, abChosen) {
        let sakuraBackgroundElement, body = $("body")[0];

        // 尝试保存地址，如果没有保存成功，则不会进行接下来的代码
        let api = IndexedDBAPI();
        let saveResult = api.addBackgroundURL(url);
        if (!saveResult) {
            logSakuraBackgroundInfo("保存失败,在写入数据库时发生错误,没有任何背景受到更改");
            return;
        }

        if (abChosen == "bili") {
            if ($("#app").length > 0) {
                sakuraBackgroundElement = "#app";
            } else {
                if ($(".sakuraBackground").length > 0) {
                    // 存在就直接使用
                    sakuraBackgroundElement = ".sakuraBackground";
                } else {
                    // 不存在就创建一个
                    let div = document.createElement("div")
                    body.appendChild(div);
                    div.className = "sakuraBackground";
                    sakuraBackgroundElement = "sakuraBackground";
                }
            }
            $(sakuraBackgroundElement).css({
                'background': 'url(' + url + ')',
                'background-repeat': 'no-repeat',
                'position': 'fixed',
                'background-position': 'center center',
                'background-size': 'cover',
                'zoom': '1',
                'width': '100%',
                'height': '100%',
                'top': '0',
                'left': '0',
                'webkit-background-size': 'cover',
                'z-index': '-1',
                'class': 'SakuraBackground'
            });
        } else if (abChosen == "acfun") {
            if ($('#main').length > 0) {
                sakuraBackgroundElement = "#main";
            } else {
                if ($(".sakuraBackground").length > 0) {
                    // 存在就直接使用
                    sakuraBackgroundElement = ".sakuraBackground";
                } else {
                    // 不存在就创建一个
                    let div = document.createElement("div")
                    body.appendChild(div);
                    div.className = "sakuraBackground";
                    sakuraBackgroundElement = "sakuraBackground";
                }
            }
            $(sakuraBackgroundElement).css({
                'background-image': 'url(' + url + ')',
                'background-repeat': 'no-repeat',
                'position': 'fixed',
                'background-position': 'center center',
                'background-size': 'cover',
                'zoom': '1',
                'width': '100%',
                'height': '100%',
                'top': '0',
                'left': '0',
                'webkit-background-size': 'cover',
                'z-index': '-1',
                'class': 'SakuraBackground'
            });
        }
        // setDivClassSakuraBackground(url, elBody);
    }

    //背景div生成
    function setDivClassSakuraBackground(url, elBody) {
        if ($('#sakuraBackground')) {

        }
    }


    /**
     * @returns {String} 返回一个url或base64值
     */
    function getBcurl() {
        let url = window.localStorage.getItem('bcurl');
        return url;
    }
    //indexedDBAPI转移至js中,使用require调用相应js

    /**
     * @name 首次信息提示
     * @description 首次alert会提示脚本注意事项,并且在每次脚本启动时,都会在控制台中打印提示信息
     * @returns {void}
     */
    function checkSakuraBackgroundInfoAlert() {
        // 检查 localStorage 中的键值对
        let alertShown = localStorage.getItem("SakuraBackgroundInfoAlert");
        let info = `特别提示:本脚本受图片质量影响,如果使用过大图片,容易使indexedDB读取缓慢,
        浏览器性能极大下降,请谨慎使用本地图片.网络图片不会影响,但受网络速率,是否有墙等因素影响.
        脚本作者:SakuraMikku.有问题请在脚本界面查询联系或反馈方式`;
        if (!alertShown) {
            alert(info);
            localStorage.setItem("SakuraBackgroundInfoAlert", "true");
        }
        console.log(`[SakuraBackgroundInfo]  ${info}`)
    }
    /**
     * @name 封装的console.log
     * @description 用于输出脚本信息
     * @param  {...any} args 
     */
    function logSakuraBackgroundInfo(...args) {
        let prefixedArgs = args.map(arg => "[SakuraBackgroundInfo] " + arg);
        console.log.apply(this, prefixedArgs);
    }

    //#endregion
}