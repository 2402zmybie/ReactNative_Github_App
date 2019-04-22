import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
//引入react-redux
import { connect } from 'react-redux'
import actions from "../action/index";

class Trending extends Component<Props> {
    render() {
        const {navigation} = this.props;
        return (
            <View>
                <Text>{'趋势'}</Text>
                <Button title={'改变主体颜色'} onPress={() => {
                        this.props.onThemeChange('#096')
                    }
                }/>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({})

//将dispatch创建函数  关联到props里面
const mapDispatchToProps = dispatch => {
    return {
        onThemeChange: theme => dispatch(actions.onThemeChange(theme))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Trending)

