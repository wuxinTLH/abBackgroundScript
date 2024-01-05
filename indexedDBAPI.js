/*
* @name         浏览器数据库API
* @namespace    IndexedDBAPI
* @description  浏览器数据库API
* @icon         http://github.smiku.site/sakura.png
* @license      MIT
* @version      1.0.0.0
* @author       SakuraMikku
* @copyright    2023-2099, SakuraMikku
*/
function logSakuraBackgroundInfo(...args) {
    let prefixedArgs = args.map(arg => "[SakuraBackgroundInfo] " + arg);
    console.log.apply(this, prefixedArgs);
}

/**
 * @name IndexedDBAPI
 * @description 判断用户使用的浏览器,并调用相应数据库,存储图片地址或图片base64格式
 * @returns {IndexedDBAPI}
 */
function IndexedDBAPI() {
    let db;
    const dbName = 'backgroundURL';
    const storeName = 'bcurl';
    let operationResult;
    let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    if (!indexedDB) {
        return {
            addBackgroundURL: function (url) {
                try {
                    let remainingSpace = 5 * 1024 * 1024 - new Blob([JSON.stringify(localStorage)]).size;
                    if (url.length > remainingSpace) {
                        throw new Error('localStorage剩余容量不够使其保存图片base64格式或图片地址');
                    }
                    localStorage.setItem(storeName, url);
                } catch (error) {
                    alert(error);
                    logSakuraBackgroundInfo("[ERROR] " + error);
                    return false;
                }
                return true;
            },
            getBackgroundURL: function (callback) {
                let url = localStorage.getItem(storeName);
                callback(url);
            },
            deleteBackgroundURL: function () {
                try {
                    localStorage.removeItem(storeName);
                    logSakuraBackgroundInfo("Background URL deleted successfully from localStorage.");
                } catch (error) {
                    logSakuraBackgroundInfo("[ERROR] Failed to delete background URL from localStorage: " + error);
                }
            },
        };
    } else {
        let request = indexedDB.open(dbName, 1);

        request.onerror = function (event) {
            logSakuraBackgroundInfo("[ERROR] Database error: " + event.target.errorCode);
        };

        request.onsuccess = function (event) {
            db = event.target.result;
        };

        request.onupgradeneeded = function (event) {
            db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                let objectStore = db.createObjectStore(storeName, { keyPath: "id" });
            }
        };

        return {
            addBackgroundURL: function (url) {
                let chunkSize = 5 * 1024 * 1024;
                let chunks = [];
                for (let i = 0; i < url.length; i += chunkSize) {
                    chunks.push(url.slice(i, i + chunkSize));
                }

                let transaction = db.transaction([storeName], "readwrite");
                let objectStore = transaction.objectStore(storeName);
                objectStore.clear();

                chunks.forEach(function (chunk, index) {
                    objectStore.add({ id: index, data: chunk });
                });
                this.closeConnection();

                return true;
            },
            getBackgroundURL: function (callback) {
                let transaction = db.transaction([storeName], "readonly");
                let objectStore = transaction.objectStore(storeName);
                let chunks = [];
                let request = objectStore.openCursor();
                let _self = this;
                request.onsuccess = function (event) {
                    let cursor = event.target.result;
                    if (cursor) {
                        chunks.push(cursor.value.data);
                        cursor.continue();
                    } else {
                        let url = chunks.join('');
                        _self.closeConnection();
                        callback(url);
                    }
                };
                request.onerror = function (event) {
                    _self.closeConnection();
                    callback('');
                };
            },
            deleteBackgroundURL: function () {
                let transaction = db.transaction([storeName], "readwrite");
                let objectStore = transaction.objectStore(storeName);
                let request = objectStore.clear();

                request.onsuccess = function () {
                    logSakuraBackgroundInfo("Background URL deleted successfully.");
                };

                request.onerror = function (event) {
                    logSakuraBackgroundInfo("[ERROR] Failed to delete background URL: " + event.target.errorCode);
                };

                this.closeConnection();
                return true;
            },
            closeConnection: function () {
                db.close();
            }
        };
    }
}

// 使用示例
// 创建IndexedDBAPI对象
let api = IndexedDBAPI();

// 添加背景图片URL
let addResult = api.addBackgroundURL('https://example.com/background.jpg');
if (addResult) {
    console.log('Background URL added successfully');
} else {
    console.error('Failed to add background URL');
}

// 获取背景图片URL
api.getBackgroundURL(function (url) {
    if (url) {
        console.log('Background URL:', url);
    } else {
        console.error('Failed to get background URL');
    }
});

// 删除背景图片URL
let deleteResult = api.deleteBackgroundURL();
if (deleteResult) {
    console.log('Background URL deleted successfully');
} else {
    console.error('Failed to delete background URL');
}

