// ==UserScript==
// @name         AB站网页背景更改
// @description  更改ab站背景的脚本，第三代版本，进一步优化代码
// @icon         http://github.smiku.site/sakura.png
// @license      MIT
// @bilibili     https://space.bilibili.com/29058270
// @github       https://github.com/wuxintlh/
// @githubBoke   https://wuxintlh.github.io
// @acfun        https://www.acfun.cn/u/57391284
// @version      1.0.0.0
// @author       SakuraMikku
// @copyright    SakuraMikku
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
// @QQgroup      793513923
// @QQgroup      https://jq.qq.com/?_wv=1027&k=0ewDiWw1
// @grant        none
// @require      https://greasyfork.org/scripts/445358-ab%E7%AB%99%E8%83%8C%E6%99%AF%E6%9B%B4%E6%94%B9css/code/ab%E7%AB%99%E8%83%8C%E6%99%AF%E6%9B%B4%E6%94%B9css.js?version=1053244
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2/dist/vue.js
// @namespace https://greasyfork.org/users/599643
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
        //初始化backgroundBox
        setBackgroundBox(abChosen);
        //将backgroundBox进行vue绑定
        let BackgroundBoxVue = new Vue({
            el: '#sakuraBackgroundBox',
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
        if (ab_chosen == "bili") {
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

    function setBackgroundImage(url, abChosen) {

    }

    //背景div生成
    function setDivClassSakuraBackground(elBody) { }

    /**
     * 在window的localStorage中存储url或base64值
     * @param {String} url 
     */
    function setBcurl(url) {
        if (url) {
            window.localStorage.setItem('bcurl', url);
        }
    }

    /**
     * @returns {String} 返回一个url或base64值
     */
    function getBcurl() {
        let url = window.localStorage.getItem('bcurl');
        return url;
    }

    //#endregion
}