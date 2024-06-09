const pageHelper = require('../../../../../helper/page_helper.js');
const cloudHelper = require('../../../../../helper/cloud_helper.js');
const EnrollBiz = require('../../../biz/enroll_biz.js');
const validate = require('../../../../../helper/validate.js');
const PublicBiz = require('../../../../../comm/biz/public_biz.js');
const ProjectBiz = require('../../../biz/project_biz.js');
const PassportBiz = require('../../../../../comm/biz/passport_biz.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLoad: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        ProjectBiz.initPage(this);

        if (!await PassportBiz.loginMustBackWin(this)) return;

        if (!pageHelper.getOptions(this, options)) return;

        this.setData(EnrollBiz.initJoinFormData());
        this.setData({
            isLoad: true
        });
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () { },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () { },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () { },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () { },

    url: function (e) {
        pageHelper.url(e, this);
    },


    bindFormSubmit: async function () {

        let data = this.data;
        data = validate.check(data, EnrollBiz.CHECK_JOIN_FORM, this);
        if (!data) return;


        let forms = this.selectComponent("#cmpt-form").getForms(true);
        if (!forms) return;
        data.forms = forms;
        data.enrollId = this.data.id;

        try {

            // 创建
            let result = await cloudHelper.callCloudSumbit('enroll/join', data);
            let enrollJoinId = result.data.enrollJoinId;

            // 图片
            await cloudHelper.transFormsTempPics(forms, 'enroll/join/', enrollJoinId, 'enroll/update_join_forms');

            let callback = async function () {
                PublicBiz.removeCacheList('admin-enroll-join-list');
                PublicBiz.removeCacheList('enroll-join-list');

                let parent = pageHelper.getPrevPage(2);
                if (parent) {
                    parent._loadDetail();
                }
                wx.navigateBack();

            }
            pageHelper.showSuccToast('打卡成功', 2000, callback);

        } catch (err) {
            console.log(err);
        }
    },


})