import React,{ Component } from 'react'
import { Modal, Text,View,TouchableOpacity,StyleSheet,DeviceInfo} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import TimeSpan from '../model/TimeSpan'

export const TimeSpans = [new TimeSpan('今 天','since=daily'),new TimeSpan('本 周','since=weekly'),new TimeSpan('本 月','since=monthly'),]
export default class TrendingDialog extends Component {
    //有两种方式可以初始化state 第一种是在构造中,第二种如下
    state = {
        visible: false
    }
    show() {
        this.setState({
            visible: true
        })
    }
    dismiss() {
        this.setState({
            visible: false
        })
    }

    render() {
        const { onClose, onSelect } = this.props
        return <Modal
                transparent={true}
                visible={this.state.visible}
                onRequestClose={() => onClose}>
                <TouchableOpacity
                    onPress={() => this.dismiss()}
                    style={styles.container}
                >
                    <MaterialIcons
                        name={'arrow-drop-up'}
                        size={36}
                        style={styles.arrow}
                    />
                    <View style={styles.content}>
                        { TimeSpans.map((result,i,arr) => {
                            return <TouchableOpacity
                                onPress={() => onSelect(arr[i])}
                                underlayColor='transparent'>
                                <View style={styles.text_container}>
                                    <Text style={styles.text}>{arr[i].showText}</Text>
                                </View>
                                {/*下划线*/}
                                {
                                    i !== TimeSpans.length -1 ? <View style={styles.line}></View> : null
                                }
                            </TouchableOpacity>
                        })}
                    </View>
                </TouchableOpacity>
            </Modal>
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'rgba(0,0,0,.6)',
        flex: 1,
        alignItems: 'center',
        paddingTop: DeviceInfo.isIPhoneX_deprecated ? 30: -30
    },
    arrow: {
        marginTop: 20,
        color:'white',
        padding: 0,
        margin: -15
    },
    content: {
       backgroundColor: 'white',
        borderRadius: 3,
        paddingTop:3,
        paddingBottom: 3,
        marginRight: 3
    },
    text_container: {
        flexDirection:'row',
        justifyContent:'center'
    },
    text: {
        fontSize: 16,
        color: 'black',
        padding: 8,
        paddingLeft:26,
        paddingRight: 26
    },
    line: {
        height: 0.3,
        backgroundColor: 'darkgray'
    }
})
