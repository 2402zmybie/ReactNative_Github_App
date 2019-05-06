import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableNativeFeedback,TouchableOpacity,Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'

export default class PopularItem extends Component {

    render() {
        const {item,onSelect} = this.props;
        if (!item || !item.owner) return null;
        //定义一个可以收藏的按钮
        let FavoriteButton = <TouchableOpacity style={{padding: 6}}  underlayColor={'transparent'}>
                                <FontAwesome name={'star-o'} size={26} style={{color:'red'}}/>
                            </TouchableOpacity>
        return (
            <TouchableNativeFeedback onPress={onSelect}>
                <View style={styles.cell_container}>
                    <Text style={styles.title}>{item.full_name}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <View style={styles.row}>
                        <View style={styles.row}>
                            <Text>Author:</Text>
                            <Image
                                style={{height:22,width:22}}
                                source={{uri:item.owner.avatar_url}}
                            />
                        </View>
                        <View style={styles.row}>
                            <Text>Star:</Text>
                            <Text>{item.stargazers_count}</Text>
                        </View>
                        {FavoriteButton}
                    </View>
                </View>
            </TouchableNativeFeedback>
        )
    }
}

const styles = StyleSheet.create({
    cell_container: {
        backgroundColor:'white',
        padding:10,
        marginLeft:5,
        marginRight:5,
        marginVertical:5,
        borderColor:'#ddd',
        borderWidth:0.5,
        borderRadius:2,
        shadowColor:'gray',
        shadowOffset:{width: 0.5,height: 0.5},
        shadowOpacity:0.4,
        shadowRadius:1,
        elevation:2
    },
    title: {
        fontSize:16,
        marginBottom:2,
        color: '#212121'
    },
    description: {
        fontSize:14,
        marginBottom:2,
        color: '#757575'
    },
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems:'center'
    }
})