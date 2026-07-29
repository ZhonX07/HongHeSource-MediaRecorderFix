// ==UserScript==
// @name         红河资源下载站 - MediaRecorder 强制硬编优化
// @namespace    https://github.com/AwP0rtuh1ty/HongHeSource-MediaRecorderFix
// @version      1.0.0
// @description  强制将网页 MediaRecorder 录制配置修改为 MP4 容器与 AVC1 编码，触发 GPU 硬件加速，解决 CPU 满载与掉帧问题。
// @author       ZhonX07
// @match        *://*.honghemc.cn/*
// @run-at       document-start
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    const OriginalMediaRecorder = window.MediaRecorder;
    if (!OriginalMediaRecorder) return;

    function CustomMediaRecorder(stream, options = {}) {
        // 优先使用 MP4 容器 + AVC1 (H.264) 触发 GPU 硬件编码
        const preferredMime = 'video/mp4;codecs=avc1.42E01E'; 

        if (OriginalMediaRecorder.isTypeSupported(preferredMime)) {
            options.mimeType = preferredMime;
            console.log('[Tampermonkey] 强制开启 GPU 硬件编码: video/mp4;codecs=avc1.42E01E');
        } else if (OriginalMediaRecorder.isTypeSupported('video/mp4')) {
            options.mimeType = 'video/mp4';
            console.log('[Tampermonkey] 回退至通用 MP4 容器格式');
        } else {
            console.warn('[Tampermonkey] 当前环境不支持 MP4 录制');
        }

        return new OriginalMediaRecorder(stream, options);
    }

    // 继承原型链
    CustomMediaRecorder.prototype = OriginalMediaRecorder.prototype;
    Object.setPrototypeOf(CustomMediaRecorder, OriginalMediaRecorder);

    // 确保静态方法完整继承并正确绑定上下文
    CustomMediaRecorder.isTypeSupported = OriginalMediaRecorder.isTypeSupported.bind(OriginalMediaRecorder);

    // 覆盖全局对象
    window.MediaRecorder = CustomMediaRecorder;

    console.log('[Tampermonkey] MediaRecorder 拦截补丁已成功注入！');
})();
