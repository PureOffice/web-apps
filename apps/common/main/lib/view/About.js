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
/**
 *  About.js
 *
 *  Created on 3/06/14
 *
 */

define([
    'common/main/lib/component/BaseView',
    'common/main/lib/component/Scroller'
], function () { 'use strict';

    // [OHOS: lic-dialog] 许可/声明全文弹层（原 ascshim 55_lic 注入段源码化）：
    // 全屏遮罩 + iframe srcdoc 渲染本地文本；点遮罩框外关闭。
    var __ohosLicMask = null, __ohosLicTitle = null, __ohosLicFrame = null;
    function __ohosShowLicDialog(href, titleText) {
        if (!__ohosLicMask) {
            __ohosLicMask = document.createElement('div');
            __ohosLicMask.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100001;display:none;';
            var _box = document.createElement('div');
            _box.style.cssText = 'position:absolute;width:84%;height:84%;left:8%;top:8%;' +
                'background:#fff;border-radius:8px;overflow:hidden;display:flex;flex-direction:column;' +
                'box-shadow:0 6px 30px rgba(0,0,0,.3);';
            var _bar = document.createElement('div');
            _bar.style.cssText = 'height:44px;background:#f2f2f2;flex:none;display:flex;' +
                'align-items:center;justify-content:space-between;padding:0 14px;';
            __ohosLicTitle = document.createElement('span');
            __ohosLicTitle.style.cssText = 'color:#444;font-size:14px;';
            var _close = document.createElement('button');
            _close.textContent = '✕ 关闭';
            _close.style.cssText = 'border:none;background:transparent;color:#444;font-size:16px;' +
                'cursor:pointer;padding:4px 8px;';
            _close.onclick = function () { __ohosLicMask.style.display = 'none'; };
            _bar.appendChild(__ohosLicTitle);
            _bar.appendChild(_close);
            __ohosLicFrame = document.createElement('iframe');
            __ohosLicFrame.style.cssText = 'flex:1;border:none;width:100%;background:#fff;';
            _box.appendChild(_bar);
            _box.appendChild(__ohosLicFrame);
            __ohosLicMask.appendChild(_box);
            __ohosLicMask.addEventListener('click', function (e) {
                if (e.target === __ohosLicMask) { __ohosLicMask.style.display = 'none'; }
            });
            document.body.appendChild(__ohosLicMask);
        }
        // 打开时把其下的官方 dialog（欢迎页 AboutDialog 等原生 <dialog class="dlg">）
        // 关掉——遮罩全屏覆盖，下面叠着面板无意义
        try {
            document.querySelectorAll('dialog.dlg').forEach(function (d) {
                if (typeof d.close === 'function') { d.close(); }
            });
        } catch (e) {}
        __ohosLicTitle.textContent = titleText;
        __ohosLicFrame.srcdoc = '<pre style="white-space:pre-wrap;padding:20px 24px;font:12px/1.6 monospace;color:#333;">加载中…</pre>';
        __ohosLicMask.style.display = 'block';
        fetch(href)
            .then(function (r) { return r.text(); })
            .then(function (txt) {
                var esc = String(txt).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                __ohosLicFrame.srcdoc = '<pre style="white-space:pre-wrap;padding:20px 24px;' +
                    'font:12px/1.6 monospace;color:#333;">' + esc + '</pre>';
            })
            .catch(function () {
                __ohosLicFrame.srcdoc = '<pre style="padding:20px 24px;color:#c00;">加载失败：' + href + '</pre>';
            });
    }

    Common.Views.About = Common.UI.BaseView.extend(_.extend({
        menu: undefined,
        rendered: false,
        options: {
            alias: 'Common.Views.About'
        },

        initialize: function(options) {
            Common.UI.BaseView.prototype.initialize.call(this,arguments);

            this.txtVersionNum = '{{PRODUCT_VERSION}}';

            !(/\s$/.test(this.txtAddress)) && (this.txtAddress += " ");
            !(/\s$/.test(this.txtMail)) && (this.txtMail += " ");
            !(/\s$/.test(this.txtTel)) && (this.txtTel += " ");
            !(/\s$/.test(this.txtVersion)) && (this.txtVersion += " ");

            this.template = _.template([
                '<table id="id-about-licensor-logo" cols="1" style="width: 100%; margin-top: 20px;">',
                    '<tr>',
                        '<td align="center"><div class="asc-about-office"></div></td>',
                    '</tr>',
                    '<tr>',
                        // [OHOS: about-brand] appName 为主品牌主视觉（Pure Office，
                        // 保形不上转；asc-about-brand 样式在 about.less）
                        '<td align="center"><label class="asc-about-brand">' + options.appName + '</label></td>',
                    '</tr>',
                    '<tr>',
                        '<td align="center"><label class="asc-about-version" id="id-about-licensor-version-name">' + this.txtVersion + this.txtVersionNum + '</label></td>',
                    '</tr>',
                    // [OHOS: about-brand] 归属/许可行 + 源码/声明行（AGPL §6 对应源码
                    // 可得 + 官方附加条款 3 识别原始开发者/修改版声明；点击 lic-open
                    // 链接由 render 尾的弹层渲染全文，不走 target=_blank——ArkWeb 无
                    // 多窗口语义）
                    '<tr><td align="center"><label class="asc-about-lic asc-about-note">基于 ONLYOFFICE DesktopEditors（<a class="link lic-open" href="/onlyoffice/licenses/LICENSE.txt">AGPL-3.0</a>）</label></td></tr>',
                    '<tr><td align="center"><label class="asc-about-lic asc-about-note">完整源码与第三方声明见&nbsp;<a class="link lic-open" href="/onlyoffice/licenses/NOTICE.txt">NOTICE</a></label></td></tr>',
                '</table>',
                // [OHOS: about-brand] licensor 公司信息表整体隐藏（归属声明保留在随包
                // LICENSE/NOTICE 与源码头，官方附加条款不要求 UI 展示联系方式）
                '<table id="id-about-licensor-info" cols="3" style="width: 100%;" class="hidden margin-bottom">',
                    '<tr>',
                        '<td colspan="3" align="center" style="padding: 20px 0 10px 0;"><label class="asc-about-companyname"><%= publishername %></label></td>',
                    '</tr>',
                    '<tr>',
                        '<td colspan="3" align="center" class="padding-small">',
                        '<label class="asc-about-desc-name">' + this.txtAddress + '</label>',
                        '<label class="asc-about-desc"><%= publisheraddr %></label>',
                        '</td>',
                    '</tr>',
                    '<tr>',
                        '<td colspan="3" align="center" class="padding-small">',
                        '<label class="asc-about-desc-name">' + this.txtMail + '</label>',
                        '<a href="mailto:<%= supportemail %>"><%= supportemail %></a>',
                        '</td>',
                    '</tr>',
                    '<tr>',
                        '<td colspan="3" align="center" class="padding-small">',
                        '<label class="asc-about-desc-name">' + this.txtTel + '</label>',
                        '<label class="asc-about-desc" dir="ltr"><%= phonenum %></label>',
                        '</td>',
                    '</tr>',
                    '<tr>',
                        '<td colspan="3" align="center">',
                        '<a href="<%= publisherurl %>" target="_blank"><% print(publisherurl.replace(/https?:\\/{2}/, "").replace(/\\/$/,"")) %></a>',
                        '</td>',
                    '</tr>',
                '</table>',
                '<table id="id-about-licensee-info" cols="1" style="width: 100%; margin-top: 20px;" class="hidden margin-bottom"><tbody>',
                    '<tr>',
                        '<td align="center" class="padding-small"><div id="id-about-company-logo"></div></td>',
                    '</tr>',
                    '<tr>',
                        // [OHOS: about-brand] 同 licensor：保形 + 主视觉 class
                        '<td align="center"><label class="asc-about-brand">' + options.appName  + '</label></td>',
                    '</tr>',
                    '<tr>',
                        '<td align="center"><label style="padding-bottom: 29px;" class="asc-about-version" id="id-about-licensee-version-name">' + this.txtVersion + this.txtVersionNum + '</label></td>',
                    '</tr>',
                    '<tr>',
                        '<td align="center" class="padding-small">',
                            '<label class="asc-about-companyname" id="id-about-company-name"></label>',
                        '</td>',
                    '</tr>',
                    '<tr>',
                        '<td align="center" class="padding-small">',
                            '<label class="asc-about-desc-name">' + this.txtAddress + '</label>',
                            '<label class="asc-about-desc" id="id-about-company-address"></label>',
                        '</td>',
                    '</tr>',
                    '<tr>',
                        '<td align="center" class="padding-small">',
                            '<label class="asc-about-desc-name">' + this.txtMail + '</label>',
                            '<a href="mailto:" id="id-about-company-mail"></a>',
                        '</td>',
                    '</tr>',
                    '<tr>',
                        '<td align="center" class="padding-small">',
                            '<label class="asc-about-desc-name">' + this.txtTel + '</label>',
                            '<label class="asc-about-desc" id="id-about-company-tel"></label>',
                        '</td>',
                    '</tr>',
                    '<tr>',
                        '<td align="center" class="padding-small">',
                            '<a href="" target="_blank" id="id-about-company-url"></a>',
                        '</td>',
                    '</tr>',
                    '<tr>',
                        '<td align="center">',
                            '<label class="asc-about-lic" id="id-about-company-lic"></label>',
                        '</td>',
                    '</tr>',
                '</table>',
                '<table id="id-about-licensor-short" cols="1" style="width: 100%; margin-top: 31px;" class="hidden"><tbody>',
                    '<tr>',
                        '<td style="width:50%;"><div class="separator horizontal short left"></div></td>',
                        '<td align="center"><label class="asc-about-header">' + this.txtPoweredBy + '</label></td>',
                        '<td style="width:50%;"><div class="separator horizontal short"></div></td>',
                    '</tr>',
                    '<tr>',
                        '<td colspan="3" align="center" style="padding: 9px 0 10px;"><label class="asc-about-companyname"><%= publishername %></label></td>',
                    '</tr>',
                    '<tr>',
                        '<td colspan="3" align="center">',
                            '<a href="<%= publisherurl %>" target="_blank"><% print(publisherurl.replace(/https?:\\/{2}/, "").replace(/\\/$/,"")) %></a>',
                        '</td>',
                    '</tr>',
                '</table>'
            ].join(''));
            this.menu = options.menu;
        },

        render: function() {
            if ( !this.rendered ) {
                this.rendered = true;

                var _$l = $(this.template({
                    publishername: '{{PUBLISHER_NAME}}',
                    publisheraddr: '{{PUBLISHER_ADDRESS}}',
                    publisherurl: '{{PUBLISHER_URL}}',
                    supportemail: '{{SUPPORT_EMAIL}}',
                    phonenum: '{{PUBLISHER_PHONE}}',
                    scope: this
                }));

                this.cntLicenseeInfo = _$l.findById('#id-about-licensee-info');
                this.cntLicensorInfo = _$l.findById('#id-about-licensor-info');
                this.divCompanyLogo = _$l.findById('#id-about-company-logo');
                this.lblCompanyName = _$l.findById('#id-about-company-name');
                this.lblCompanyAddress = _$l.findById('#id-about-company-address');
                this.lblCompanyMail = _$l.findById('#id-about-company-mail');
                this.lblCompanyUrl = _$l.findById('#id-about-company-url');
                this.lblCompanyLic = _$l.findById('#id-about-company-lic');
                this.lblCompanyTel = _$l.findById('#id-about-company-tel');

                this.$el.html(_$l);
                this.$el.addClass('about-dlg');

                if ( this.licData )
                    this.setLicInfo(this.licData);

                if (_.isUndefined(this.scroller)) {
                    this.scroller = new Common.UI.Scroller({
                        el: this.$el,
                        suppressScrollX: true
                    });
                }

                // [OHOS: lic-dialog] 许可/声明全文弹层（ArkWeb 无多窗口，链接点击
                // 由源内弹层渲染——fetch 文本 → iframe srcdoc，不依赖服务器 MIME）。
                // 原通用拦截器（ascshim 55_lic 注入段按 target=_blank+localhost 全局
                // 捕获拦截）由此收敛为面板内精准触发。
                this.$el.off('click', 'a.lic-open').on('click', 'a.lic-open', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    var href = $(this).attr('href');
                    __ohosShowLicDialog(href, /\/NOTICE\.txt$/i.test(href) ? '第三方声明与源码获取' : '许可证文本');
                    return false;
                });
            }

            return this;
        },

        setLicInfo: function(data){
            if ( !this.rendered ) {
                this.licData = data || true;
            } else {
                if (data && typeof data == 'object' && data.customer && typeof(data.customer)=='object') {
                    this.licData = data;
                    var customer = data.customer;

                    $('#id-about-licensor-logo').addClass('hidden');
                    $('#id-about-licensor-short').removeClass('hidden');
                    this.cntLicensorInfo.addClass('hidden');

                    this.cntLicenseeInfo.removeClass('hidden');
                    this.cntLicensorInfo.removeClass('margin-bottom');

                    var value = customer.name;
                    value && value.length ?
                        this.lblCompanyName.text(value) :
                        this.lblCompanyName.parents('tr').addClass('hidden');

                    value = customer.address;
                    value && value.length ?
                        this.lblCompanyAddress.text(value) :
                        this.lblCompanyAddress.parents('tr').addClass('hidden');

                    (value = customer.mail) && value.length ?
                        this.lblCompanyMail.attr('href', "mailto:"+value).text(value) :
                        this.lblCompanyMail.parents('tr').addClass('hidden');

                    value = customer.phone;
                    value && value.length ?
                        this.lblCompanyTel.text(value) :
                        this.lblCompanyTel.parents('tr').addClass('hidden');

                    if ((value = customer.www) && value.length) {
                        var http = !/^https?:\/{2}/i.test(value) ? "http:\/\/" : '';
                        this.lblCompanyUrl.attr('href', http+value).text(value);
                    } else
                        this.lblCompanyUrl.parents('tr').addClass('hidden');

                    (value = customer.info) && value.length ?
                        this.lblCompanyLic.text(value) :
                        this.lblCompanyLic.parents('tr').addClass('hidden');

                    value = Common.UI.Themes.isDarkTheme() ? (customer.logoDark || customer.logo) : (customer.logo || customer.logoDark);
                    value && value.length ?
                        this.divCompanyLogo.html('<img src="'+value+'" style="max-width:216px; max-height: 35px;" />') :
                        this.divCompanyLogo.parents('tr').addClass('hidden');
                    value && value.length && Common.NotificationCenter.on('uitheme:changed', this.changeLogo.bind(this));
                } else {
                    this.cntLicenseeInfo.addClass('hidden');
                    this.cntLicensorInfo.addClass('margin-bottom');
                }
            }
        },

        changeLogo: function () {
            if (!this.licData) return;

            var customer = this.licData.customer;
            if ( customer.logo && customer.logoDark && customer.logo !== customer.logoDark) {
                this.divCompanyLogo.find('img').attr('src', Common.UI.Themes.isDarkTheme() ? (customer.logoDark || customer.logo) : (customer.logo || customer.logoDark));
            }
        },

        show: function () {
            if ( !this.rendered ) this.render();

            Common.UI.BaseView.prototype.show.call(this,arguments);
            this.fireEvent('show', this );
        },

        hide: function () {
            Common.UI.BaseView.prototype.hide.call(this,arguments);
            this.fireEvent('hide', this );
        },

        setMode: function(mode){
            if (mode.isLightVersion) {
                $('#id-about-licensor-version-name').text(this.txtEdition + this.txtVersion + this.txtVersionNum);
                $('#id-about-licensee-version-name').text(this.txtEdition + this.txtVersion + this.txtVersionNum);
            }
        },

        txtPoweredBy: 'Powered by',
        txtVersion: 'Version ',
        txtLicensor: 'LICENSOR',
        txtLicensee: 'LICENSEE',
        txtAddress: 'address: ',
        txtMail: 'email: ',
        txtTel: 'tel.: ',
        txtEdition: 'Integration Edition '

    }, Common.Views.About || {}));
});
