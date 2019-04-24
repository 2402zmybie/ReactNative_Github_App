import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,FlatList,RefreshControl} from 'react-native';
import PopularItem from '../common/PopularItem'

import {createMaterialTopTabNavigator} from 'react-navigation'

//引入connect
import { connect } from 'react-redux'
import actions from '../action'

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars'
const THEME_COLOR = 'red'

export default class PopularPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.tabNames = ['Java','Android','Ios','React','React Native','PHP']
    }

    _genTabs() {
        const tabs = {};
        this.tabNames.forEach((item,index) => {
            //初始化顶部tab的时候 向页面传递参数
            tabs[`tab${index}`] = {
                screen: props => <PopularTabPage {...props} tabLabel={item}/>,
                navigationOptions: {
                    title:item
                }
            }
        })
        return tabs;
    }


    render() {
        const TopTab = createMaterialTopTabNavigator(this._genTabs(),{
            tabBarOptions: {
                tabStyle:styles.tabStyle,
                scrollEnabled:true,
                upperCaseLabel:false,
                style: {
                    backgroundColor:'#678'
                },
                indicatorStyle:styles.indicatorStyle,
                labelStyle:styles.labelStyle
            }
        })
        return <TopTab/>
    }
}

//PopolarTab让其进行绑定
class PopularTab extends Component<Props> {
    constructor(props) {
        super(props)
        const { tabLabel } = this.props;
        this.storeName = tabLabel;
    }
    componentDidMount() {
        this.loadData();
    }
    loadData() {
        const url = this.genFetchUrl(this.storeName);
        this.props.onLoadPopularData(this.storeName,url)
    }
    genFetchUrl(key) {
        return URL + key + QUERY_STR;
    }
    renderItem(data) {
        const item = data.item;
        return <PopularItem
                item = {item}
                onSelect={() => {
                    console.warn('条目被点击了')
                }}
        />
    }

    render() {
        const {popular} = this.props;
        let store = popular[this.storeName]  //动态获取state
        if(!store) {
            store = {
                items: [],
                isLoading: false
            }
        }
        return (
            <View>
                <FlatList
                    data={store.items}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => item.id + ''}
                    refreshControl={
                        <RefreshControl
                            title={'Loading'}
                            titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => this.loadData()}
                            tintColor={THEME_COLOR}
                        />
                    }
                />
            </View>
        )
    }
}
const mapStateToProps = state => ({
    popular: state.popular
})
const mapDispatchToProps = dispatch => ({
    onLoadPopularData: (storeName,url) => dispatch(actions.onLoadPopularData(storeName,url))
})
const PopularTabPage = connect(mapStateToProps,mapDispatchToProps)(PopularTab);



const styles = StyleSheet.create({
    tabStyle: {
        minWidth:50
    },
    indicatorStyle: {
        height:2,
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize:13,
        marginTop:6,
        marginBottom:6
    }
})

