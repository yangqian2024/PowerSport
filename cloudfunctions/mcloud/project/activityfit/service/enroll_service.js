/**
 * Notes: 打卡模块业务逻辑
 * Ver : CCMiniCloud Framework 3.2.11 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * Date: 2023-04-26 07:48:00 
 */

const BaseProjectService = require('./base_project_service.js');
const util = require('../../../framework/utils/util.js');
const dataUtil = require('../../../framework/utils/data_util.js');
const timeUtil = require('../../../framework/utils/time_util.js');
const cloudUtil = require('../../../framework/cloud/cloud_util.js');
const UserModel = require('../model/user_model.js');
const EnrollModel = require('../model/enroll_model.js');
const EnrollJoinModel = require('../model/enroll_join_model.js');
const EnrollUserModel = require('../model/enroll_user_model.js');

class EnrollService extends BaseProjectService {

	// 获取当前打卡状态
	getJoinStatusDesc(enroll) {
		let timestamp = this._timestamp;

		if (enroll.ENROLL_STATUS == 0)
			return '已停止';
		else if (enroll.ENROLL_START > timestamp)
			return '未开始';
		else if (enroll.ENROLL_END <= timestamp)
			return '已结束';
		else
			return '进行中';
	}

	// 获取某日动态
    async getEnrollJoinByDay(
        {
            enrollId,
            day,
            search, // 搜索条件
            sortType, // 搜索菜单
            sortVal, // 搜索菜单
            orderBy, // 排序 
            page,
            size,
            isTotal = true,
            oldTotal
        }) {
		if (!day) day = timeUtil.time('Y-M-D');

		let where = {
			ENROLL_JOIN_ENROLL_ID: enrollId,
			ENROLL_JOIN_DAY: day,
			ENROLL_JOIN_STATUS: EnrollJoinModel.STATUS.SUCC
		}

		if (util.isDefined(search) && search) {
			where['user.USER_NAME'] = ['like', search];
		}

		let joinParams = {
			from: UserModel.CL,
			localField: 'ENROLL_JOIN_USER_ID',
			foreignField: 'USER_MINI_OPENID',
			as: 'user',
		};

        orderBy = orderBy || {
            'ENROLL_JOIN_ADD_TIME': 'desc'
        };

        let fields = 'ENROLL_JOIN_OBJ,ENROLL_JOIN_ADD_TIME,user.USER_NAME,user.USER_PIC';
        return await EnrollJoinModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	// 获取某活动排行
	async getEnrollUserRank(enrollId) {

		let where = {
			ENROLL_USER_ENROLL_ID: enrollId,
			ENROLL_USER_JOIN_CNT: ['>', 0]
		}
		let joinParams = {
			from: UserModel.CL,
			localField: 'ENROLL_USER_MINI_OPENID',
			foreignField: 'USER_MINI_OPENID',
			as: 'user',
		};
		let orderBy = {
			ENROLL_USER_JOIN_CNT: 'desc'
		}
		let fields = 'ENROLL_USER_JOIN_CNT,ENROLL_USER_LAST_DAY,user.USER_NAME,user.USER_PIC';
		let list = await EnrollUserModel.getListJoin(joinParams, where, fields, orderBy, 1, 100, false, 0);
		return list.list;
	}

	/** 浏览信息 */
	async viewEnroll(userId, id) {

		let fields = '*';

		let where = {
			_id: id,
			ENROLL_STATUS: EnrollModel.STATUS.COMM
		}
		let enroll = await EnrollModel.getOne(where, fields);
		if (!enroll) return null;

		EnrollModel.inc(id, 'ENROLL_VIEW_CNT', 1);

		// 判断用户今日是否有打卡
		let whereJoin = {
			ENROLL_JOIN_USER_ID: userId,
			ENROLL_JOIN_ENROLL_ID: id,
			ENROLL_JOIN_DAY: timeUtil.time('Y-M-D'),
			ENROLL_JOIN_STATUS: EnrollJoinModel.STATUS.SUCC
		}
		let enrollJoin = await EnrollJoinModel.getOne(whereJoin);
		if (enrollJoin) {
			enroll.myEnrollJoinId = enrollJoin._id;
		}
		else {
			enroll.myEnrollJoinId = '';
		}

		// 打卡日期数组
		let dayList = [];
		let start = timeUtil.timestamp2Time(enroll.ENROLL_START, 'Y-M-D');
		start = timeUtil.time2Timestamp(start);
		let today = timeUtil.time2Timestamp(timeUtil.time('Y-M-D'));

		for (let k = start; k <= today;) {
			let month = timeUtil.timestamp2Time(k, 'M月');
			if (month.startsWith('0')) month = month.substring(1);

			let date = timeUtil.timestamp2Time(k, 'D');
			let day = timeUtil.timestamp2Time(k, 'Y-M-D');

			dayList.push({ month, date, day });
			k = k + 86400 * 1000;
		}
		enroll.dayList = dayList;

		// 排行榜 
		let rankList = await this.getEnrollUserRank(id);
		enroll.rankList = rankList;

        // 我的打卡记录 
        enroll.myJoinList = await this.getMyEnrollJoinList(userId, { enrollId: id, size: 100 });
        for (let k = 0; k < enroll.myJoinList.list.length; k++) {
            enroll.myJoinList.list[k].ENROLL_JOIN_ADD_TIME = timeUtil.timestamp2Time(enroll.myJoinList.list[k].ENROLL_JOIN_ADD_TIME, 'Y-M-D h:m');
        }

		return enroll;
	}


	/** 取得分页列表 */
	async getEnrollList({
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'ENROLL_ORDER': 'asc',
			'ENROLL_ADD_TIME': 'desc'
		};
		let fields = 'ENROLL_USER_LIST,ENROLL_JOIN_CNT,ENROLL_OBJ,ENROLL_USER_CNT,ENROLL_TITLE,ENROLL_START,ENROLL_END,ENROLL_ORDER,ENROLL_STATUS,ENROLL_CATE_NAME,ENROLL_OBJ';

		let where = {};
		where.and = {
			_pid: this.getProjectId() //复杂的查询在此处标注PID
		};

		where.and.ENROLL_STATUS = EnrollModel.STATUS.COMM; // 状态  

		if (util.isDefined(search) && search) {
			where.or = [{
				ENROLL_TITLE: ['like', search]
			},];
		} else if (sortType && util.isDefined(sortVal)) {
			// 搜索菜单
			switch (sortType) {
				case 'cateId': {
					if (sortVal) where.and.ENROLL_CATE_ID = String(sortVal);
					break;
				}
				case 'sort': {
					orderBy = this.fmtOrderBySort(sortVal, 'ENROLL_ADD_TIME');
					break;
				}
				case 'today': { //今天
					let day = timeUtil.time('Y-M-D');
					where.and.ENROLL_DAYS = day;
					break;
				}
				case 'tomorrow': { //明日
					let day = timeUtil.time('Y-M-D', 86400);
					where.and.ENROLL_DAYS = day;
					break;
				}
				case 'yesterday': { //昨天 
					let day = timeUtil.time('Y-M-D', -86400);
					where.and.ENROLL_DAYS = day;
					break;
				}
				case 'month': { //本月 
					let day = timeUtil.time('Y-M-D');
					let start = timeUtil.getMonthFirstTimestamp(day);
					let end = timeUtil.getMonthLastTimestamp(day);
					start = timeUtil.timestamp2Time(start, 'Y-M-D');
					end = timeUtil.timestamp2Time(end, 'Y-M-D'); 
					where.and.ENROLL_DAYS = ['between', start, end];
					break;
				}

			}
		}

		return await EnrollModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	/** 取得我的打卡分页列表 */
	async getMyEnrollUserList(userId, {
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {
		orderBy = orderBy || {
			'ENROLL_USER_ADD_TIME': 'asc'
		};
		let fields = 'ENROLL_USER_LAST_DAY,ENROLL_USER_ENROLL_ID,ENROLL_USER_JOIN_CNT,enroll.ENROLL_TITLE,enroll.ENROLL_OBJ.cover,enroll.ENROLL_USER_CNT,enroll.ENROLL_CATE_NAME,enroll.ENROLL_DAY_CNT,enroll.ENROLL_START,enroll.ENROLL_END,enroll.ENROLL_STATUS';

		let where = {
			ENROLL_USER_MINI_OPENID: userId
		};

		if (util.isDefined(search) && search) {
			where['enroll.ENROLL_TITLE'] = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType) {
			// 搜索菜单
			let timestamp = this._timestamp;

			switch (sortType) {
				case 'stop': {
					where['enroll.ENROLL_STATUS'] = 0;
					break;
				}
				case 'un': {
					where['enroll.ENROLL_START'] = ['>', timestamp];
					break;
				}
				case 'over': {
					where['enroll.ENROLL_END'] = ['<=', timestamp];
					break;
				}
				case 'run': {
					where['enroll.ENROLL_STATUS'] = 1;
					where['enroll.ENROLL_START'] = ['<=', timestamp];
					where['enroll.ENROLL_END'] = ['>', timestamp];
					break;
				}

			}
		}

		let joinParams = {
			from: EnrollModel.CL,
			localField: 'ENROLL_USER_ENROLL_ID',
			foreignField: '_id',
			as: 'enroll',
		};

		let result = await EnrollUserModel.getListJoin(joinParams, where, fields, orderBy, page, size, isTotal, oldTotal);


		let list = result.list;
		for (let k = 0; k < list.length; k++) {
			let enroll = {
				ENROLL_START: list[k].enroll.ENROLL_START,
				ENROLL_END: list[k].enroll.ENROLL_END,
				ENROLL_STATUS: list[k].enroll.ENROLL_STATUS,
			}
			let status = this.getJoinStatusDesc(enroll);

			if (status == '进行中') {
				if (list[k].ENROLL_USER_LAST_DAY == timeUtil.time('Y-M-D'))
					status = '已打卡';
			}
			list[k].status = status;

			list[k].last = list[k].ENROLL_USER_LAST_DAY.split('-')[1] + '-' + list[k].ENROLL_USER_LAST_DAY.split('-')[2];
		}

		return result;
	}

	/** 取得我的打卡清单列表 */
	async getMyEnrollJoinList(userId, {
		enrollId,
		search, // 搜索条件
		sortType, // 搜索菜单
		sortVal, // 搜索菜单
		orderBy, // 排序 
		page,
		size,
		isTotal = true,
		oldTotal
	}) {
		orderBy = orderBy || {
			'ENROLL_JOIN_ADD_TIME': 'desc'
		};
		let fields = '*';

		let where = {
			ENROLL_JOIN_USER_ID: userId,
			ENROLL_JOIN_ENROLL_ID: enrollId
		};

        let pic = '';
        let name = '';
        let user = await UserModel.getOne({ USER_MINI_OPENID: userId });
        if (user) {
            pic = user.USER_PIC;
            name = user.USER_NAME;
        }

        let result = await EnrollJoinModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
        result.pic = pic;
        result.name = name;

        return result;
	}


	//################## 打卡 
	addEnrollUserList(userList, user) {

		//查询是否存在 并删除
		for (let k = 0; k < userList.length; k++) {
			if (userList[k].id == user.id)
				userList.splice(k, 1);
		}

		userList.unshift(user);

		// 判断个数， 多的删除
		if (userList.length > 3)
			userList.splice(userList.length - 1, 1);

		return userList;
	}

	// 打卡 
	async enrollJoin(userId, enrollId, forms) {

		let user = await UserModel.getOne({ USER_MINI_OPENID: userId, USER_STATUS: UserModel.STATUS.COMM });
		if (!user) this.AppError('用户不存在');

		// 打卡是否结束
		let whereEnroll = {
			_id: enrollId,
			ENROLL_STATUS: EnrollModel.STATUS.COMM
		}
		let enroll = await EnrollModel.getOne(whereEnroll);
		if (!enroll)
			this.AppError('该打卡活动不存在或者已经停止');

		// 是否打卡开始
		if (enroll.ENROLL_START > this._timestamp)
			this.AppError('该打卡活动尚未开始');

		// 是否过了打卡结束期
		if (enroll.ENROLL_END < this._timestamp)
			this.AppError('该打卡活动已经结束');

		let day = timeUtil.time('Y-M-D');

		// 自己今日是否已经有打卡
		let whereMy = {
			ENROLL_JOIN_USER_ID: userId,
			ENROLL_JOIN_ENROLL_ID: enrollId,
			ENROLL_JOIN_DAY: day,
			ENROLL_JOIN_STATUS: EnrollJoinModel.STATUS.SUCC
		}
		let my = await EnrollJoinModel.getOne(whereMy);
		if (my) {
			this.AppError('您今日已打卡，无须重复打卡');
		}

		// 入库
		let data = {
			ENROLL_JOIN_USER_ID: userId,
			ENROLL_JOIN_ENROLL_ID: enrollId,
			ENROLL_JOIN_STATUS: EnrollJoinModel.STATUS.SUCC,
			ENROLL_JOIN_DAY: day,

            ENROLL_JOIN_OBJ: dataUtil.dbForms2Obj(forms),
            ENROLL_JOIN_FORMS: forms,
		}

		let enrollJoinId = await EnrollJoinModel.insert(data);

		// 统计数量
		await this.statEnrollJoin(enrollId, userId);

        return { enrollJoinId }

    }

    // 更新forms信息
    async updateJoinForms({
        id,
        hasImageForms
    }) {
        await EnrollJoinModel.editForms(id, 'ENROLL_JOIN_FORMS', 'ENROLL_JOIN_OBJ', hasImageForms);

	}

	// 统计
	async statEnrollJoin(enrollId, userId = '', del = false) {
		// 总体统计
		let where = {
			ENROLL_JOIN_ENROLL_ID: enrollId,
			ENROLL_JOIN_STATUS: EnrollJoinModel.STATUS.SUCC
		}
		let joinCnt = await EnrollJoinModel.count(where);
		let userCnt = await EnrollJoinModel.distinctCnt(where, 'ENROLL_JOIN_USER_ID');

		let data = {
			ENROLL_JOIN_CNT: joinCnt,
			ENROLL_USER_CNT: userCnt,
		}
		await EnrollModel.edit(enrollId, data);

		// 用户统计
		if (!userId) return;
		where = {
			ENROLL_JOIN_USER_ID: userId,
			ENROLL_JOIN_ENROLL_ID: enrollId,
			ENROLL_JOIN_STATUS: EnrollJoinModel.STATUS.SUCC
		}
		let userJoinCnt = await EnrollJoinModel.count(where);


		let enrollUserData = {};
		enrollUserData.ENROLL_USER_LAST_DAY = timeUtil.time('Y-M-D');
		enrollUserData.ENROLL_USER_JOIN_CNT = userJoinCnt;
		enrollUserData.ENROLL_USER_DAY_CNT = userJoinCnt;

		where = {
			ENROLL_USER_MINI_OPENID: userId,
			ENROLL_USER_ENROLL_ID: enrollId
		};
		await EnrollUserModel.insertOrUpdate(where, enrollUserData);


		if (del) {
			//删除打卡记录，则更新最近打卡时间
			let last = '';
			where = {
				ENROLL_JOIN_USER_ID: userId,
				ENROLL_JOIN_ENROLL_ID: enrollId,
				ENROLL_JOIN_STATUS: EnrollJoinModel.STATUS.SUCC
			}
			let lastModel = await EnrollJoinModel.getOne(where, 'ENROLL_JOIN_DAY', { 'ENROLL_JOIN_ADD_TIME': 'desc' });
			if (lastModel) last = lastModel.ENROLL_JOIN_DAY;

			where = {
				ENROLL_USER_MINI_OPENID: userId,
				ENROLL_USER_ENROLL_ID: enrollId
			};
			await EnrollUserModel.edit(where, { ENROLL_USER_LAST_DAY: last });
		}

        // 用户头像列表
        where = {
            ENROLL_USER_ENROLL_ID: enrollId,
			ENROLL_USER_JOIN_CNT: ['>', 0]
        }
        let joinParams = {
            from: UserModel.CL,
            localField: 'ENROLL_USER_MINI_OPENID',
            foreignField: 'USER_MINI_OPENID',
            as: 'user',
        };
        let orderBy = {
            ENROLL_USER_LAST_DAY: 'desc'
        }
        let userList = await EnrollUserModel.getListJoin(joinParams, where, 'ENROLL_USER_LAST_DAY,user.USER_MINI_OPENID,user.USER_NAME,user.USER_PIC', orderBy, 1, 6, false, 0);

        userList = userList.list;
        for (let k = 0; k < userList.length; k++) {
            userList[k] = userList[k].user;
        }
        EnrollModel.edit(enrollId, { ENROLL_USER_LIST: userList });

	}


    /** 取消我的今日打卡 */
    async cancelMyEnrollJoin(userId, enrollId) {
        let where = {
            ENROLL_JOIN_USER_ID: userId,
            ENROLL_JOIN_ENROLL_ID: enrollId,
            ENROLL_JOIN_DAY: timeUtil.time('Y-M-D'),
            ENROLL_JOIN_STATUS: ['in', [EnrollJoinModel.STATUS.WAIT, EnrollJoinModel.STATUS.SUCC]]
        };
        let enrollJoin = await EnrollJoinModel.getOne(where);

        if (!enrollJoin) {
            this.AppError('未找到可取消的记录');
        }

        cloudUtil.handlerCloudFilesForForms(enrollJoin.ENROLL_JOIN_FORMS, []);

        await EnrollJoinModel.del(where);

		await this.statEnrollJoin(enrollId, userId, true);

    }


}

module.exports = EnrollService;