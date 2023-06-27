/**
 * Notes: 打卡模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2022-06-24 07:48:00 
 */

const BaseBiz = require('../../../comm/biz/base_biz.js');
const pageHelper = require('../../../helper/page_helper.js');
const cloudHelper = require('../../../helper/cloud_helper.js');
const projectSetting = require('../public/project_setting.js');

class EnrollBiz extends BaseBiz { 

	static getCateName(cateId) {
		return BaseBiz.getCateName(cateId, projectSetting.ENROLL_CATE);
	}

	static getCateList() {
		return BaseBiz.getCateList(projectSetting.ENROLL_CATE);
	}

	static setCateTitle() {
		return BaseBiz.setCateTitle(projectSetting.ENROLL_CATE);
	}


    static initJoinFormData() { 
		return {
			fields: projectSetting.ENROLL_JOIN_FIELDS,
			formForms: [], 
				}
				}

	}

EnrollBiz.CHECK_JOIN_FORM = {
	forms: 'formForms|array',
};

module.exports = EnrollBiz;