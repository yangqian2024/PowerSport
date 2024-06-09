/**
 * Notes: 路由配置文件
  * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY cclinux0730 (wechat)
 * User: CC
 * Date: 2020-10-14 07:00:00
 */

module.exports = {
	'test/test': 'test/test_controller@test',

	'home/setup_get': 'home_controller@getSetup',

	'passport/login': 'passport_controller@login',
	'passport/phone': 'passport_controller@getPhone',
	'passport/my_detail': 'passport_controller@getMyDetail',
	'passport/register': 'passport_controller@register',
	'passport/edit_base': 'passport_controller@editBase',

	// 收藏
	'fav/update': 'fav_controller@updateFav',
	'fav/del': 'fav_controller@delFav',
	'fav/is_fav': 'fav_controller@isFav',
	'fav/my_list': 'fav_controller@getMyFavList',

	'admin/home': 'admin/admin_home_controller@adminHome',
	'admin/clear_vouch': 'admin/admin_home_controller@clearVouchData',

	'admin/login': 'admin/admin_mgr_controller@adminLogin',
	'admin/mgr_list': 'admin/admin_mgr_controller@getMgrList',
	'admin/mgr_insert': 'admin/admin_mgr_controller@insertMgr#demo',
	'admin/mgr_del': 'admin/admin_mgr_controller@delMgr#demo',
	'admin/mgr_detail': 'admin/admin_mgr_controller@getMgrDetail',
	'admin/mgr_edit': 'admin/admin_mgr_controller@editMgr#demo',
	'admin/mgr_status': 'admin/admin_mgr_controller@statusMgr#demo',
	'admin/mgr_pwd': 'admin/admin_mgr_controller@pwdMgr#demo',
	'admin/log_list': 'admin/admin_mgr_controller@getLogList',
	'admin/log_clear': 'admin/admin_mgr_controller@clearLog#demo',

	'admin/setup_set': 'admin/admin_setup_controller@setSetup#demo',
	'admin/setup_set_content': 'admin/admin_setup_controller@setContentSetup#demo',
	'admin/setup_qr': 'admin/admin_setup_controller@genMiniQr',

	// 用户
	'admin/user_list': 'admin/admin_user_controller@getUserList',
	'admin/user_detail': 'admin/admin_user_controller@getUserDetail',
	'admin/user_del': 'admin/admin_user_controller@delUser#demo',
	'admin/user_status': 'admin/admin_user_controller@statusUser#demo',

	'admin/user_data_get': 'admin/admin_user_controller@userDataGet',
	'admin/user_data_export': 'admin/admin_user_controller@userDataExport',
	'admin/user_data_del': 'admin/admin_user_controller@userDataDel',

	// 产品 
	'product/list': 'product_controller@getProductList',
	'product/view': 'product_controller@viewProduct',

	'admin/product_list': 'admin/admin_product_controller@getAdminProductList',
	'admin/product_insert': 'admin/admin_product_controller@insertProduct#demo',
	'admin/product_detail': 'admin/admin_product_controller@getProductDetail',
	'admin/product_edit': 'admin/admin_product_controller@editProduct#demo',
	'admin/product_update_forms': 'admin/admin_product_controller@updateProductForms#demo',
	'admin/product_del': 'admin/admin_product_controller@delProduct#demo',
	'admin/product_sort': 'admin/admin_product_controller@sortProduct#demo',
	'admin/product_vouch': 'admin/admin_product_controller@vouchProduct#demo',
	'admin/product_status': 'admin/admin_product_controller@statusProduct#demo',



	// 打卡
	'enroll/list': 'enroll_controller@getEnrollList',
	'enroll/view': 'enroll_controller@viewEnroll',
	'enroll/join_day': 'enroll_controller@getEnrollJoinByDay',
	'enroll/join': 'enroll_controller@enrollJoin',
	'enroll/my_join_cancel': 'enroll_controller@cancelMyEnrollJoin',
	'enroll/update_join_forms': 'enroll_controller@updateJoinForms',
	'enroll/my_join_list': 'enroll_controller@getMyEnrollJoinList',
	'enroll/my_user_list': 'enroll_controller@getMyEnrollUserList',

	'admin/enroll_list': 'admin/admin_enroll_controller@getAdminEnrollList',
	'admin/enroll_insert': 'admin/admin_enroll_controller@insertEnroll#demo',
	'admin/enroll_detail': 'admin/admin_enroll_controller@getEnrollDetail',
	'admin/enroll_edit': 'admin/admin_enroll_controller@editEnroll#demo',
	'admin/enroll_update_forms': 'admin/admin_enroll_controller@updateEnrollForms#demo',
	'admin/enroll_clear': 'admin/admin_enroll_controller@clearEnrollAll#demo',
	'admin/enroll_del': 'admin/admin_enroll_controller@delEnroll#demo',
	'admin/enroll_sort': 'admin/admin_enroll_controller@sortEnroll#demo',
	'admin/enroll_vouch': 'admin/admin_enroll_controller@vouchEnroll#demo',
	'admin/enroll_status': 'admin/admin_enroll_controller@statusEnroll#demo',
	'admin/enroll_join_list': 'admin/admin_enroll_controller@getEnrollJoinList',
	'admin/enroll_join_del': 'admin/admin_enroll_controller@delEnrollJoin#demo',
	'admin/enroll_join_data_get': 'admin/admin_enroll_controller@enrollJoinDataGet',
	'admin/enroll_join_data_export': 'admin/admin_enroll_controller@enrollJoinDataExport',
	'admin/enroll_join_data_del': 'admin/admin_enroll_controller@enrollJoinDataDel',


	// 内容  
	'home/list': 'home_controller@getHomeList',
	'news/list': 'news_controller@getNewsList',
	'news/view': 'news_controller@viewNews',

	'admin/news_list': 'admin/admin_news_controller@getAdminNewsList',
	'admin/news_insert': 'admin/admin_news_controller@insertNews#demo',
	'admin/news_detail': 'admin/admin_news_controller@getNewsDetail',
	'admin/news_edit': 'admin/admin_news_controller@editNews#demo',
	'admin/news_update_forms': 'admin/admin_news_controller@updateNewsForms#demo',
	'admin/news_update_pic': 'admin/admin_news_controller@updateNewsPic#demo',
	'admin/news_update_content': 'admin/admin_news_controller@updateNewsContent#demo',
	'admin/news_del': 'admin/admin_news_controller@delNews#demo',
	'admin/news_sort': 'admin/admin_news_controller@sortNews#demo',
	'admin/news_status': 'admin/admin_news_controller@statusNews#demo',


	// 评论
	'comment/list': 'comment_controller@getCommentList',
	'comment/insert': 'comment_controller@insertComment',
	'comment/update_forms': 'comment_controller@updateCommentForms',
	'comment/del': 'comment_controller@delComment', 
	
	// 活动
	'activity/list': 'activity_controller@getActivityList',
	'activity/join_list': 'activity_controller@getActivityJoinList',
	'activity/view': 'activity_controller@viewActivity',
	'activity/detail_for_join': 'activity_controller@detailForActivityJoin',
	'activity/join': 'activity_controller@activityJoin',
	'activity/list_by_day': 'activity_controller@getActivityListByDay',
	'activity/list_has_day': 'activity_controller@getActivityHasDaysFromDay',
	'activity/my_join_list': 'activity_controller@getMyActivityJoinList',
	'activity/my_join_cancel': 'activity_controller@cancelMyActivityJoin',
	'activity/my_join_detail': 'activity_controller@getMyActivityJoinDetail',
	'activity/my_join_someday': 'activity_controller@getMyActivityJoinSomeday',
	'activity/my_join_self': 'activity_controller@myJoinSelf',

	'admin/activity_list': 'admin/admin_activity_controller@getAdminActivityList',
	'admin/activity_insert': 'admin/admin_activity_controller@insertActivity#demo',
	'admin/activity_detail': 'admin/admin_activity_controller@getActivityDetail',
	'admin/activity_edit': 'admin/admin_activity_controller@editActivity#demo',
	'admin/activity_update_forms': 'admin/admin_activity_controller@updateActivityForms#demo',
	'admin/activity_clear': 'admin/admin_activity_controller@clearActivityAll#demo',
	'admin/activity_del': 'admin/admin_activity_controller@delActivity#demo',
	'admin/activity_sort': 'admin/admin_activity_controller@sortActivity#demo',
	'admin/activity_vouch': 'admin/admin_activity_controller@vouchActivity#demo',
	'admin/activity_status': 'admin/admin_activity_controller@statusActivity#demo',
	'admin/activity_join_list': 'admin/admin_activity_controller@getActivityJoinList',
	'admin/activity_join_status': 'admin/admin_activity_controller@statusActivityJoin#demo',
	'admin/activity_cancel_join_all': 'admin/admin_activity_controller@cancelActivityJoinAll#demo',
	'admin/activity_join_del': 'admin/admin_activity_controller@delActivityJoin#demo',
	'admin/activity_join_scan': 'admin/admin_activity_controller@scanActivityJoin',
	'admin/activity_join_checkin': 'admin/admin_activity_controller@checkinActivityJoin',
	'admin/activity_self_checkin_qr': 'admin/admin_activity_controller@genActivitySelfCheckinQr',
	'admin/activity_join_data_get': 'admin/admin_activity_controller@activityJoinDataGet',
	'admin/activity_join_data_export': 'admin/admin_activity_controller@activityJoinDataExport',
	'admin/activity_join_data_del': 'admin/admin_activity_controller@activityJoinDataDel',


}