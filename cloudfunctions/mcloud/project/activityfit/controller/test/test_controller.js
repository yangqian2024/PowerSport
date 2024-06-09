/**
 * Notes: 测试模块控制器
 * Date: 2021-03-15 19:20:00 
 */

const BaseController = require('../../controller/base_project_controller.js');
const fakerLib = require('../../../../framework/lib/faker_lib.js');
const dataUtil = require('../../../../framework/utils/data_util.js');
const timeUtil = require('../../../../framework/utils/time_util.js');

const UserModel = require('../../model/user_model.js');
const ActivityModel = require('../../model/activity_model.js');
const CommentModel = require('../../model/comment_model.js');
const ActivityJoinModel = require('../../model/activity_join_model.js');
const ActivityService = require('../../service/activity_service.js');

const EnrollService = require('../../service/enroll_service.js');
const EnrollModel = require('../../model/enroll_model.js');
const EnrollUserModel = require('../../model/enroll_user_model.js');
const EnrollJoinModel = require('../../model/enroll_join_model.js');

class TestController extends BaseController {

    async test() {
  
        global.PID = 'activityfit';

        console.log('TEST>>>>>>>' + global.PID);


		//await this.mockUser();
		//await this.mockEnrollUser();
        //await this.mockEnrollJoin();

		//await this.mockActivityJoin();
		await this.mockActivityComment()
    }



    async mockUser() {
        console.log('mockUser >>>>>>> Begin....');

        console.log('>>>>delete');
		let delCnt = await UserModel.del({});
		console.log('>>>>delete=' + delCnt);

        for (let k = 1; k <= 50; k++) {
			console.log('>>>>insert user >' + k);

            let user = {};
            user.USER_MINI_OPENID = global.PID + '_' + k;
            user.USER_NAME = fakerLib.getName();
            user.USER_MOBILE = fakerLib.getMobile();
            user.USER_PIC = fakerLib.getAvatar();
            await UserModel.insert(user);

        }

        console.log('mockUse <<<< END');
    }

    async mockActivityJoin() {
        console.log('mockActivityJoin >>>>>>> Begin....');

		let delCnt = await ActivityJoinModel.del({});
		console.log('>>>>delete mockActivityJoin =' + delCnt);

        let activityService = new ActivityService();

        let list = await ActivityModel.getAll({});
        for (let k in list) {
            let node = list[k];
            console.log('title=' + list[k].ACTIVITY_TITLE);

            let step = fakerLib.getIntBetween(10, 30);
            for (let j = 0; j < step; j++) {
				console.log('>>>>insert activity join >' + j);

                let data = {};
                data.ACTIVITY_JOIN_ACTIVITY_ID = node._id;
                data.ACTIVITY_JOIN_USER_ID = global.PID + '_' + fakerLib.getIntBetween(1, 48);
                data.ACTIVITY_JOIN_CODE = fakerLib.getIntStr(10);

                data.ACTIVITY_JOIN_FORMS = [
                    { mark: 'name', title: '姓名', type: 'text', val: fakerLib.getName() },
                    { mark: 'phone', title: '手机', type: 'mobile', val: fakerLib.getMobile() }
                ];
                data.ACTIVITY_JOIN_OBJ = dataUtil.dbForms2Obj(data.ACTIVITY_JOIN_FORMS);

                await ActivityJoinModel.insert(data);
            }

            // 统计
            await activityService.statActivityJoin(node._id);

        }

        console.log('mockActivityJoin >>>>>>> END');
    }


    async mockActivityComment() {
        console.log('mockActivityComment >>>>>>> Begin....');

        let list = await CommentModel.getAll({});
        for (let k in list) {
			console.log('insert comment>' + k);
            let node = list[k];
            let data = {};
            data.COMMENT_USER_ID = global.PID + '_' + fakerLib.getIntBetween(1, 48);
            await CommentModel.edit(node._id, data);

        }

        console.log('mockActivityComment >>>>>>> END');
    }


    async mockEnrollJoin() {


        console.log('mockEnrollJoin >>>>>>> Begin....');

        console.log('>>>>delete mockEnrollJoin');
		let delCnt = await EnrollJoinModel.del({});
		console.log('>>>>delete mockEnrollJoin =' + delCnt);

        let enrollService = new EnrollService();

        let list = await EnrollModel.getAll({});
        for (let k in list) {
            let node = list[k];
            console.log('title=' + list[k].ENROLL_TITLE);

			let step = fakerLib.getIntBetween(50, 80);
            for (let j = 0; j < step; j++) {
				console.log('>>>>insert enroll join>' + j);

                let data = {};
                data.ENROLL_JOIN_ENROLL_ID = node._id;
                data.ENROLL_JOIN_USER_ID = global.PID + '_' + fakerLib.getIntBetween(1, 48);

				data.ENROLL_JOIN_DAY = fakerLib.getDate(timeUtil.time('Y-M-D', -86400 * 2), timeUtil.time('Y-M-D'), 'Y-M-D');

				data.ENROLL_JOIN_OBJ = {
					content: '打卡成功！',
					img: []
				}

                await EnrollJoinModel.insert(data);


            }

            // 统计
            await enrollService.statEnrollJoin(node._id);

            // 用户头像
            let userList = [];
            userList.push({
				USER_MINI_OPENID: global.PID + '_' + fakerLib.getIntBetween(1, 48),
				USER_NAME: fakerLib.getName(),
				USER_PIC: fakerLib.getAvatar()
            },
                {
					USER_MINI_OPENID: global.PID + '_' + fakerLib.getIntBetween(1, 48),
					USER_NAME: fakerLib.getName(),
					USER_PIC: fakerLib.getAvatar(),
                },
                {
					USER_MINI_OPENID: global.PID + '_' + fakerLib.getIntBetween(1, 48),
					USER_NAME: fakerLib.getName(),
					USER_PIC: fakerLib.getAvatar()
                });
            await EnrollModel.edit(node._id, { ENROLL_USER_LIST: userList });
        }


        console.log('mockEnrollJoin >>>>>>> END');
    }

    async mockEnrollUser() {
        console.log('mockEnrollUser >>>>>>> Begin....');

        console.log('>>>>mockEnrollUser delete');
		let delCnt = await EnrollUserModel.del({});
		console.log('>>>>mockEnrollUser delete=' + delCnt);

        let list = await EnrollModel.getAll({});
        for (let k in list) {
            let node = list[k];

            console.log('title=' + list[k].ENROLL_TITLE);

            let step = fakerLib.getIntBetween(10, 30);
            for (let j = 0; j < step; j++) {
				console.log('>>>>insert enroll user>' + j);

                let data = {};
                data.ENROLL_USER_ENROLL_ID = node._id;
                data.ENROLL_USER_MINI_OPENID = global.PID + '_' + fakerLib.getIntBetween(1, 48);

                data.ENROLL_USER_JOIN_CNT = fakerLib.getIntBetween(1, 48);
                data.ENROLL_USER_DAY_CNT = fakerLib.getIntBetween(1, 48);

                data.ENROLL_USER_LAST_DAY = fakerLib.getDate('2023-01', '2023-04', 'Y-M')

                await EnrollUserModel.insert(data);
            }

            // 统计 
        }
        console.log('mockEnrollUser >>>>>>> END');
    }

}

module.exports = TestController;