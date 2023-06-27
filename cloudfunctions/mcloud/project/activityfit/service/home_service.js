/**
 * Notes: 全局/首页模块业务逻辑
 * Date: 2021-03-15 04:00:00 
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 */

const BaseProjectService = require('./base_project_service.js');
const setupUtil = require('../../../framework/utils/setup/setup_util.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const ActivityModel = require('../model/activity_model.js');
const EnrollModel = require('../model/enroll_model.js');

class HomeService extends BaseProjectService {

	async getSetup(key) {
		return await setupUtil.get(key);
	}

	/**首页列表 */
	async getHomeList() {
		let ActivityService = require('./activity_service.js');
		let activityService = new ActivityService();

		let fields = 'ACTIVITY_STATUS,ACTIVITY_START,ACTIVITY_TITLE,ACTIVITY_CATE_NAME,ACTIVITY_JOIN_CNT,ACTIVITY_USER_LIST,ACTIVITY_OBJ.cover,ACTIVITY_OBJ.vouch,ACTIVITY_STOP,ACTIVITY_END,ACTIVITY_MAX_CNT';
		let where = {
			ACTIVITY_STATUS: 1
		}
		let newList = await ActivityModel.getAll(where, fields, { 'ACTIVITY_ADD_TIME': 'desc' }, 10);
		for (let k = 0; k < newList.length; k++) {
			newList[k].time = timeUtil.timestamp2Time(newList[k].ACTIVITY_START, 'Y年M月D日 h:m');
			newList[k].statusDesc = activityService.getJoinStatusDesc(newList[k]);
		}

		let hotList = await ActivityModel.getAll(where, fields, { 'ACTIVITY_JOIN_CNT': 'desc', 'ACTIVITY_ADD_TIME': 'desc' }, 10);
		for (let k = 0; k < hotList.length; k++) {
			hotList[k].time = timeUtil.timestamp2Time(hotList[k].ACTIVITY_START, 'Y年M月D日 h:m');
			hotList[k].statusDesc = activityService.getJoinStatusDesc(hotList[k]);
		}

		where = {
			ENROLL_STATUS: 1
		}
		fields = 'ENROLL_TITLE,ENROLL_CATE_NAME,ENROLL_OBJ,ENROLL_JOIN_CNT,ENROLL_USER_CNT';
		let enrollList = await EnrollModel.getAll(where, fields, { 'ENROLL_VOUCH': 'desc', 'ENROLL_ADD_TIME': 'desc' }, 10); 

		return { newList, hotList, enrollList }

	}
}

module.exports = HomeService;