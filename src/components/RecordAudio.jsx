import React from 'react';
import {Popup} from "@nutui/nutui-react-taro";
import {Text, View} from "@tarojs/components";
import {useRecord} from "taro-hooks";
import {logger} from "../utils/helper";
import api from "../utils/api";
import Taro from "@tarojs/taro";

const RecordAudio = ({visible, setVisible, onSubmit}) => {
  const [permission, setPermission] = React.useState(false);
  const [recorderManager] = useRecord();
  const [second, setSecond] = React.useState(0);
  const intervalRef = React.useRef(0);

  React.useEffect(() => {
    recorderManager.onStop(e => {
      submit(e);
    });
  }, []);

  React.useEffect(() => {
    visible && getPermission();
  }, [visible]);

  async function getPermission(){
    await Taro.authorize({
      scope: 'scope.record',
      fail: err => Taro.showToast({title: '未获取到麦克风授权', icon: 'error'}),
      success: res => setPermission(true),
    });
  }

  function start(){
    if(!permission){
      Taro.showToast({title: '未获取到麦克风授权', icon: 'error'})
      return;
    }
    recorderManager.start();
    intervalRef.current = setInterval(() => {
      setSecond(s => s + 100);
    }, 100);
  }

  function stop(){
    if(!permission){
      return;
    }
    recorderManager.stop();
    clearInterval(intervalRef.current)
  }

  async function submit(e){
    try {
      const url = await api.upload(e.tempFilePath);
      onSubmit && onSubmit(url);
      setSecond(0);
      setVisible(false);
    }catch (e){

    }
  }

  return (
    <Popup visible={visible} onClose={() => setVisible(false)} round={true} position={"bottom"}>
      <View className={'flex flex-col items-center justify-center h-60'}>
        <View className={'py-6'}><Text className={['text-sm', second > 100 && 'text-green-500'].join(' ')}>已录制 {(second / 1000).toFixed(1)} 秒</Text></View>
        <View onTouchStart={() => start()} onTouchEnd={() => stop()} className={'flex flex-col items-center justify-center w-25 h-25 bg-green-400 hover:bg-green-600 rounded-full'}><Text className={'i-famicons-mic text-13 text-white'} /></View>
        <View className={'mt-4'}><Text className={'text-sm text-gray-500'}>按住说话，发送语音</Text></View>
      </View>
    </Popup>
  );
};

export default RecordAudio;
