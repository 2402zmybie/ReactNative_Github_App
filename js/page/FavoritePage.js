
import React, {Component} from 'react';
import {Button, Platform, StyleSheet, Text, View} from 'react-native';
import { connect } from 'react-redux'
import actions from "../action/index";



class FavoritePage extends Component<Props> {
  render() {
    const { navigation } = this.props
    return (
      <View>
        <Text>{'喜欢'}</Text>
        <Button title={'改变主体颜色'} onPress={() => {
            this.props.onThemeChange('#206')
          }
        }/>
      </View>
    );
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => {
    return {
        onThemeChange: theme => dispatch(actions.onThemeChange(theme))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(FavoritePage);


