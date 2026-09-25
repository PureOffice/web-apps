/*
 * Copyright (C) Ascensio System SIA, 2009-2026
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation, together with the
 * additional terms provided in the LICENSE file.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. For
 * details, see the GNU AGPL at: https://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA by email at info@onlyoffice.com
 * or by postal mail at 20A-6 Ernesta Birznieka-Upisha Street, Riga,
 * LV-1050, Latvia, European Union.
 *
 * The interactive user interfaces in modified versions of the Program
 * are required to display Appropriate Legal Notices in accordance with
 * Section 5 of the GNU AGPL version 3.
 *
 * No trademark rights are granted under this License.
 *
 * All non-code elements of the Product, including illustrations,
 * icon sets, and technical writing content, are licensed under the
 * Creative Commons Attribution-ShareAlike 4.0 International License:
 * https://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 * This license applies only to such non-code elements and does not
 * modify or replace the licensing terms applicable to the Program's
 * source code, which remains licensed under the GNU Affero General
 * Public License v3.
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */

if (window.Common === undefined) {
    window.Common = {};
}

    Common.Gateway = new(function() {
        var me = this,
            $me = $(me);

        var commandMap = {
            'init': function(data) {
                $me.trigger('init', data);
            },

            'openDocument': function(data) {
                $me.trigger('opendocument', data);
            },

            'openDocumentFromBinary': function(data) {
                $me.trigger('opendocumentfrombinary', data);
            },

            'showMessage': function(data) {
                $me.trigger('showmessage', data);
            },

            'applyEditRights': function(data) {
                $me.trigger('applyeditrights', data);
            },

            'processRightsChange': function(data) {
                $me.trigger('processrightschange', data);
            },

            'refreshHistory': function(data) {
                $me.trigger('refreshhistory', data);
            },

            'setHistoryData': function(data) {
                $me.trigger('sethistorydata', data);
            },

            'setEmailAddresses': function(data) {
                $me.trigger('setemailaddresses', data);
            },

            'setActionLink': function (data) {
                $me.trigger('setactionlink', data.url);
            },

            'processMailMerge': function(data) {
                $me.trigger('processmailmerge', data);
            },

            'downloadAs': function(data) {
                $me.trigger('downloadas', data);
            },

            'processMouse': function(data) {
                $me.trigger('processmouse', data);
            },

            'internalCommand': function(data) {
                $me.trigger('internalcommand', data);
            },

            'resetFocus': function(data) {
                $me.trigger('resetfocus', data);
            },

            'setUsers': function(data) {
                $me.trigger('setusers', data);
            },

            'showSharingSettings': function(data) {
                $me.trigger('showsharingsettings', data);
            },

            'setSharingSettings': function(data) {
                $me.trigger('setsharingsettings', data);
            },

            'insertImage': function(data) {
                $me.trigger('insertimage', data);
            },

            'setMailMergeRecipients': function(data) {
                $me.trigger('setmailmergerecipients', data);
            },

            'setRevisedFile': function(data) {
                $me.trigger('setrevisedfile', data);
            },

            'setFavorite': function(data) {
                $me.trigger('setfavorite', data);
            },

            'requestClose': function(data) {
                $me.trigger('requestclose', data);
            },

            'blurFocus': function(data) {
                $me.trigger('blurfocus', data);
            },

            'grabFocus': function(data) {
                $me.trigger('grabfocus', data);
            },

            'setReferenceData': function(data) {
                $me.trigger('setreferencedata', data);
            },

            'refreshFile': function(data) {
                $me.trigger('refreshfile', data);
            },

            'setRequestedDocument': function(data) {
                $me.trigger('setrequesteddocument', data);
            },

            'setRequestedSpreadsheet': function(data) {
                $me.trigger('setrequestedspreadsheet', data);
            },

            'setReferenceSource': function(data) {
                $me.trigger('setreferencesource', data);
            },

            'startFilling': function(data) {
                $me.trigger('startfilling', data);
            },

            'requestRoles': function(data) {
                $me.trigger('requestroles', data);
            }
        };

        var _postMessage = function(msg, buffer) {
            // TODO: specify explicit origin
            if (window.parent && window.JSON) {
                msg.frameEditorId = window.frameEditorId;
                buffer ? window.parent.postMessage(msg, "*", [buffer]) : window.parent.postMessage(window.JSON.stringify(msg), "*");
            }
        };

        var _onMessage = function(msg) {
            // TODO: check message origin
            if (msg.origin !== window.parentOrigin && msg.origin !== window.location.origin && !(msg.origin==="null" && (window.parentOrigin==="file://" || window.location.origin==="file://"))) return;

            var data = msg.data;
            if (data && data.command === 'openDocumentFromBinary') {
                handler = commandMap[data.command];
                if (handler) {
                    handler.call(this, data.data);
                }
                return;
            }

            if (Object.prototype.toString.apply(data) !== '[object String]' || !window.JSON) {
                return;
            }

            var cmd, handler;

            try {
                cmd = window.JSON.parse(data)
            } catch(e) {
                cmd = '';
            }

            if (cmd) {
                handler = commandMap[cmd.command];
                if (handler) {
                    handler.call(this, cmd.data);
                }
            }
        };

        var fn = function(e) { _onMessage(e); };

        if (window.attachEvent) {
            window.attachEvent('onmessage', fn);
        } else {
            window.addEventListener('message', fn, false);
        }

        return {

            appReady: function() {
                _postMessage({ event: 'onAppReady' });
            },

            requestEditRights: function() {
                _postMessage({ event: 'onRequestEditRights' });
            },

            requestHistory: function() {
                _postMessage({ event: 'onRequestHistory' });
            },

            requestHistoryData: function(revision) {
                _postMessage({
                    event: 'onRequestHistoryData',
                    data: revision
                });
            },

            requestRestore: function(version, url, fileType) {
                _postMessage({
                    event: 'onRequestRestore',
                    data: {
                        version: version,
                        url: url,
                        fileType: fileType
                    }
                });
            },

            requestEmailAddresses: function() {
                _postMessage({ event: 'onRequestEmailAddresses' });
            },

            requestStartMailMerge: function() {
                _postMessage({event: 'onRequestStartMailMerge'});
            },

            requestHistoryClose: function(revision) {
                _postMessage({event: 'onRequestHistoryClose'});
            },

            reportError: function(code, description) {
                _postMessage({
                    event: 'onError',
                    data: {
                        errorCode: code,
                        errorDescription: description
                    }
                });
            },

            reportWarning: function(code, description) {
                _postMessage({
                    event: 'onWarning',
                    data: {
                        warningCode: code,
                        warningDescription: description
                    }
                });
            },

            sendInfo: function(info) {
                _postMessage({
                    event: 'onInfo',
                    data: info
                });
            },

            setDocumentModified: function(modified) {
                _postMessage({
                    event: 'onDocumentStateChange',
                    data: modified
                });
            },

            internalMessage: function(type, data) {
                _postMessage({
                    event: 'onInternalMessage',
                    data: {
                        type: type,
                        data: data
                    }
                });
            },

            updateVersion: function() {
                _postMessage({ event: 'onOutdatedVersion' });
            },

            downloadAs: function(url, fileType) {
                _postMessage({
                    event: 'onDownloadAs',
                    data: {
                        url: url,
                        fileType: fileType
                    }
                });
            },

            requestSaveAs: function(url, title, fileType) {
                _postMessage({
                    event: 'onRequestSaveAs',
                    data: {
                        url: url,
                        title: title,
                        fileType: fileType
                    }
                });
            },

            collaborativeChanges: function() {
                _postMessage({event: 'onCollaborativeChanges'});
            },

            requestRename: function(title) {
                _postMessage({event: 'onRequestRename', data: title});
            },

            metaChange: function(meta) {
                _postMessage({event: 'onMetaChange', data: meta});
            },

            documentReady: function() {
                _postMessage({ event: 'onDocumentReady' });
            },

            requestClose: function() {
                // [OHOS: close] web 语义=上报宿主壳关闭（postMessage 到父帧——
                // 顶层页无接收者）；本页即宿主 → 直接回官方欢迎页（与 goback 同构）。
                // 原 ascshim 40_save 3.8.2b 对本方法的实例覆写源码化；官方「放弃修改
                // 并离开」弹框链保留——tab×/返回键的三按钮守卫在宿主层。
                // 语言=当前页 URL 的 lang 参数（宿主 EditorPage 传入，2026-09-25 起
                // 跟随系统语言）。写死中文会让英文系统下「关闭文档 → 欢迎页」语言突变。
                if (window.AscNative) {
                    console.error('LSO_REQUEST_CLOSE -> welcome');
                    var _lq = /[?&]lang=([^&]+)/.exec(window.location.search || '');
                    var _lang = _lq ? decodeURIComponent(_lq[1]) : 'en';   // 缺省英文（同 spec §6 决策 1）
                    try { window.location.href = 'http://localhost/onlyoffice/index.html?lang=' + _lang; } catch (e) {}
                    return;
                }
                _postMessage({event: 'onRequestClose'});
            },

            requestMakeActionLink: function (config) {
                _postMessage({event:'onMakeActionLink', data: config});
            },

            requestUsers:  function (command, id, from, count, search) { // from, count, search are used for mentions
                _postMessage({event:'onRequestUsers', data: {c: command, id: id, from: from, count: count, search: search}});
            },

            requestSendNotify:  function (emails) {
                _postMessage({event:'onRequestSendNotify', data: emails});
            },

            requestInsertImage:  function (command) {
                _postMessage({event:'onRequestInsertImage', data: {c: command}});
            },

            requestMailMergeRecipients:  function () {
                _postMessage({event:'onRequestMailMergeRecipients'});
            },

            requestCompareFile:  function () {
                _postMessage({event:'onRequestCompareFile'});
            },

            requestSharingSettings:  function () {
                _postMessage({event:'onRequestSharingSettings'});
            },

            requestCreateNew:  function () {
                _postMessage({event:'onRequestCreateNew'});
            },

            requestReferenceData:  function (data) {
                _postMessage({event:'onRequestReferenceData', data: data});
            },

            requestOpen:  function (data) {
                _postMessage({event:'onRequestOpen', data: data});
            },

            requestSelectDocument:  function (command) {
                _postMessage({event:'onRequestSelectDocument', data: {c: command}});
            },

            requestSelectSpreadsheet:  function (command) {
                _postMessage({event:'onRequestSelectSpreadsheet', data: {c: command}});
            },

            requestReferenceSource:  function () {
                _postMessage({event:'onRequestReferenceSource'});
            },

            requestStartFilling:  function (roles) {
                _postMessage({
                    event:'onRequestStartFilling',
                    data: roles
                });
            },

            switchEditorType:  function (value, restart) {
                _postMessage({event:'onSwitchEditorType', data: {type: value, restart: restart}});
            },

            startFilling:  function (roles) {
                _postMessage({
                    event:'onStartFilling',
                    data: roles
                });
            },

            requestFillingStatus:  function (role) {
                _postMessage({
                    event:'onRequestFillingStatus',
                    data: role
                });
            },

            pluginsReady: function() {
                _postMessage({ event: 'onPluginsReady' });
            },

            requestRefreshFile: function() {
                _postMessage({ event: 'onRequestRefreshFile' });
            },

            userActionRequired: function() {
                _postMessage({ event: 'onUserActionRequired' });
            },

            saveDocument: function(data) {
                // [OHOS: save] 保存落盘直连（原 ascshim 40_save 3.8.2b 同段的
                // 3.8.3 实例覆写源码化）：web 服务器链=postMessage 上传——本壳无
                // 服务器；base64 → execCommand('save:bin') → 宿主 x2t 落盘（与
                // [OHOS: save] asc_Save 链同一条 execCommand 通道，用户保存语义
                // 第三参=1 补录 recents）。200MB 上限为不落盘防护线。完成后复位
                // 官方保存中状态（本地链无完成通道）。
                if (window.AscNative && data) {
                    console.error('LSO_SAVEDOC len=' + (data.byteLength || data.length));
                    try {
                        var _u8 = data instanceof Uint8Array ? data : new Uint8Array(data);
                        if (_u8.length > 200 * 1024 * 1024) { console.error('LSO_SAVEDOC_TOOBIG ' + _u8.length); return; }
                        var _r = window.AscNative._call('execCommand',
                            ['save:bin', AscCommon.Base64.encode(_u8, 0, _u8.byteLength, false), 1]);
                        console.error('LSO_SAVEDOC_CALL ret=' + String(_r).slice(0, 60));
                        try {
                            if (typeof window.editor !== 'undefined' && window.editor && typeof window.editor._onSaveCallback === 'function') {
                                window.editor._onSaveCallback(null);
                            }
                        } catch (scx2) {}
                    } catch (se) { console.error('LSO_SAVEDOC_ERR ' + String(se)); }
                    return;
                }
                data && _postMessage({
                    event: 'onSaveDocument',
                    data: data.buffer
                }, data.buffer);
            },

            submitForm: function() {
                _postMessage({event: 'onSubmit'});
            },

            on: function(event, handler){
                var localHandler = function(event, data){
                    handler.call(me, data)
                };

                $me.on(event, localHandler);
            }
        }

    })();
