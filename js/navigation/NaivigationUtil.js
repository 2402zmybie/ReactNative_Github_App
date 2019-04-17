/**
 * 全局导航跳转工具类
 */
export default class NaivigationUtil {


    static goPage(page) {

        const navigation = NaivigationUtil.navigation;
        navigation.navigate(
            page
        )
    }

    static goBack(navigation) {
        navigation.goBack();
    }

    static resetToHomePage(params) {
        const {navigation} = params;
        navigation.navigate("Main")
    }
}