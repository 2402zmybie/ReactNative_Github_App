import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableNativeFeedback,TouchableOpacity,Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {PropTypes} from 'prop-types'

export default class BaseItem extends Component {

    static propTypes = {
        projectModel: PropTypes.object,
        onSelect: PropTypes.func,
        onFavorite: PropTypes.func
    }

    constructor(props) {
        super(props)
        this.state = {
            isFavorite: this.props.projectModel.isFavorite
        }
    }

    //在新版的Rn中 将componentWillReceiveProps 改成了如下的方法
    static getDerivedStateFromProps(nextProps, prevState) {
        const isFavorite = nextProps.projectModel.isFavorite;
        if(prevState.isFavorite !== isFavorite) {
            return {
                isFavorite: isFavorite
            }
        }
        return null;
    }

    setFavoriteState(isFavorite) {
        this.props.projectModel.isFavorite = isFavorite
        this.setState({
            isFavorite: isFavorite
        })
    }
    onPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite)
        //将item和收藏状态回调给具体的page
        this.props.onFavorite(this.props.projectModel.item, !this.state.isFavorite)
    }
    _favoriteIcon() {
        return <TouchableOpacity
            style={{padding: 6}}
            underlayColor={'transparent'}
            onPress={() => this.onPressFavorite()}
        >
            <FontAwesome
                name={this.state.isFavorite ? 'star' : 'star-o'}
                size={26}
                style={{color: '#678'}}
            />
        </TouchableOpacity>
    }
}
