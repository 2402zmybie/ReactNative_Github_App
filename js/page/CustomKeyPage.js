import React, {Component} from 'react';
import {Alert,ScrollView,Platform, StyleSheet, Text, View,RefreshControl,ActivityIndicator,DeviceInfo,TouchableOpacity} from 'react-native';
// 使用自定义的NavigationBar
import NavigationBar from '../common/NavigationBar'
//引入connect
import { connect } from 'react-redux'
import actions from '../action'
import FavoriteDao from "../expand/dao/FavoriteDao";
import {FLAG_STORAGE} from "../expand/dao/DataStore";
import FavoriteUtil from "../util/FavoriteUtil";
import EventTypes from "../util/EventTypes";
import {FLAG_LANGUAGE} from "../expand/dao/LanguageDao";
import BackPressComponent from "../common/BackPressComponent";
import LanguageDao from "../expand/dao/LanguageDao";
import ViewUtil from "../util/ViewUtil";
import GlobalStyles from "../res/style/GlobalStyles";
import CheckBox from 'react-native-check-box'
import Ionicons from 'react-native-vector-icons/Ionicons'
import NaivigationUtil from "../navigation/NaivigationUtil";
import ArrayUtil from "../util/ArrayUtil";


const THEME_COLOR = '#678'

class CustomKeyPage extends Component<Props> {
    constructor(props) {
        super(props)
        console.disableYellowBox = true
        this.params = this.props.navigation.state.params;
        this.backPress = new BackPressComponent({backPress: e => this.onBackPress(e)})
        this.changeValues = [];  //保存用户所触发的变更
        this.isRemoveKey = this.params.isRemoveKey;  //是不是标签移除界面
        this.languageDao = new LanguageDao(this.params.flag)
        this.state = {
            keys: []
        }
    }

    onBackPress(e) {
        this.onBack();
        return true
    }

    componentDidMount(): void {
        this.backPress.componentDidMount()
        //如果props中标签为空 则从本地存储中获取标签
        if(CustomKeyPage._keys(this.props).length === 0) {
            let { onLoadLanguage } = this.props;
            onLoadLanguage(this.params.flag)
        }
        //改变状态
        this.setState({
            keys: CustomKeyPage._keys(this.props)
        })
    }
    componentWillUnmount(): void {
        this.backPress.componentWillUnmount()
    }

    //触发onLoadLanguage的action之后 会回调这个方法
    static getDerivedStateFromProps(nextProps,prevState) {
        //如果新老数据不相等
        if(prevState.keys !== CustomKeyPage._keys(nextProps,null,prevState)) {
            //则会将新的数据 同步到state里面去
            return {
                keys: CustomKeyPage._keys(nextProps,null,prevState)
            }
        }
        return null;
    }

    /**
     * 获取标签
     * @param props
     * @param original 移除标签时候使用,是否从props获取原始对的标签
     * @param state 移除标签使用
     * @private
     */
    static _keys(props,original,state) {
        const { flag, isRemoveKey} = props.navigation.state.params;
        let key = flag === FLAG_LANGUAGE.flag_key ? 'keys' : 'languages';
        if(isRemoveKey && !original) {
            //移除标签并且不需要原始数据
            //这句话的意思是优先使用state里面的数据,如果state里面没有数据 则使用props
            return state && state.keys && state.keys.length !== 0
            && state.keys || props.language[key].map(val => {
                    return {
                        //注意: 不能直接修改props copy一份
                        ...val,
                        checked:false
                    }
                })
        }else {
            //自定义语言 和自定义标签页面
            return props.language[key]
        }

    }
    _checkedImage(checked) {
        const { theme } = this.params;
        return <Ionicons
            name={checked ? 'ios-checkbox' : 'md-square-outline'}
            size={20}
            style={{color: THEME_COLOR}}
        />
    }
    onClick(data,index){
        data.checked = !data.checked;
        ArrayUtil.updateArray(this.changeValues,data)
        //更新state以便显示选中状态
        this.state.keys[index] = data;
        this.setState({
            keys: this.state.keys
        })
    }
    renderCheckBox(data,index) {
        return <CheckBox
            style={{flex: 1,padding:10}}
            onClick={() => this.onClick(data,index)}
            isChecked={data.checked}
            leftText={data.name}
            checkedImage={this._checkedImage(true)}
            unCheckedImage={this._checkedImage(false)}
        />
    }
    renderView() {
        let dataArray = this.state.keys;
        if(!dataArray || dataArray.length === 0) return;
        let len = dataArray.length;
        let views = [];
        for(let i = 0, l = len; i < l; i+=2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {/*生成一行数据,每行显示两列*/}
                        {this.renderCheckBox(dataArray[i],i)}
                        {i + 1 < len && this.renderCheckBox(dataArray[i + 1], i+ 1)}
                    </View>
                    <View style={GlobalStyles.line}></View>
                </View>
            )
        }
        return views
    }

    //点击标题右边按钮
    onSave() {
        if(this.changeValues.length === 0) {
            NaivigationUtil.goBack(this.props.navigation)
            return
        }
        let keys;
        //移除标签的特殊处理
        if(this.isRemoveKey) {
            for(let i = 0,l = this.changeValues.length; i < l;i++) {
                ArrayUtil.remove(keys = CustomKeyPage._keys(this.props,true),this.changeValues[i],'name')
            }
        }
        //更新本地数据
        this.languageDao.save(keys || this.state.keys)
        //更新store
        const { onLoadLanguage } = this.props;
        onLoadLanguage(this.params.flag)
        NaivigationUtil.goBack(this.props.navigation)
    }
    onBack() {
        if(this.changeValues.length > 0) {
            Alert.alert('提示','要保存修改嘛?',
                [{
                    text:'否',onPress: () => {
                        NaivigationUtil.goBack(this.props.navigation)
                    }
                },{
                    text:'是',onPress: () => {
                        this.onSave()
                    }
                }]
                )
        }else {
            NaivigationUtil.goBack(this.props.navigation)
        }

    }
    render() {
        let title = this.isRemoveKey ? '标签移除' : '自定义标签'
        title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言': title
        let rightButtonTitle = this.isRemoveKey ? '移除' : '保存'
        let navigationBar = <NavigationBar
            title={title}
            style={{backgroundColor: THEME_COLOR}}
            leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            rightButton={ViewUtil.getRightButton(rightButtonTitle, () => this.onSave())}
        />
        return <View style={styles.container}>
            {navigationBar}
            <ScrollView>
                {this.renderView()}
            </ScrollView>
        </View>
    }
}

const mapPopularStateToProps = state => ({
    //直接取language,因为自定义语言和自定义标签同一个页面, 所以直接取reducer里面的language即可
    language: state.language
})
const mapPopularDispatchToProps = dispatch => ({
    onLoadLanguage: (flag) => dispatch(actions.onLoadLanguage(flag))
})
export default connect(mapPopularStateToProps,mapPopularDispatchToProps)(CustomKeyPage)


const styles = StyleSheet.create({
    container: {
        flex:1
    },
    item: {
        flexDirection:'row'
    }
})

