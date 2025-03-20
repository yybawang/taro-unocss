import React from 'react';
import {ScrollView, Text, View} from "@tarojs/components";
import {Avatar, Button, Image} from "@nutui/nutui-react-taro";
import {UserContext} from "../../utils/const";
import logo from '../../images/logo.png';
import api from "../../utils/api";
import storage from "../../utils/storage";
import Taro, {useDidShow} from "@tarojs/taro";
import {onGetPhoneNumber, wait} from "../../utils/helper";

const Index = () => {
  const [user, setUser, getUser] = React.useContext(UserContext);
  const [refreshed, setRefreshed] = React.useState(false);

  useDidShow(() => {
    getUser();
    init()
  });

  async function init(){
    await wait(1000);
  }

  async function refresh(){
    setRefreshed(true);
    await getUser();
    await init();
    setRefreshed(false);
  }

  return (
    <View className={'flex flex-col h-screen'}>
      <ScrollView scrollY={true} refresherEnabled={true} refresherTriggered={refreshed} onRefresherRefresh={() => refresh()} className={'h-screen overflow-screen'}>
        <View className={'px-3 pt-24 pb-6'} style={{backgroundImage: 'linear-gradient(to bottom, #c5deff, #F5F6F7)'}}>
          <View className={'flex items-center'} onClick={() => user && Taro.navigateTo({url: 'info'})}>
            <Avatar src={user?.avatar || logo} size={60} />
            <View className={'ml-2'}>
              {user ? user.name : <Button fill={'none'} size={"large"} openType={'getPhoneNumber|agreePrivacyAuthorization'} onGetPhoneNumber={e => onGetPhoneNumber(e).then(user => setUser(user))}><Text className={'text-gray-500'}>未登录，点击登录</Text></Button>}
              {user && <View><Text className={'text-xs text-gray-500'}>{user?.merchant ? '物流商': '货主'}</Text></View>}
            </View>
          </View>
        </View>

        {/*余额*/}
        {/*<View className={'mt-2 mx-3 py-4 bg-white rounded-md flex justify-around'}>
          <View className={'flex flex-col items-center pt-1.4'}>
            <Text className={'text-2xl'}>0</Text>
            <Text>现金余额</Text>
          </View>
          <View className={'flex flex-col items-center pt-1.4'}>
            <Text className={'text-2xl'}>0</Text>
            <Text>红包余额</Text>
          </View>
          <View className={'flex flex-col items-center'}>
            <Text className={'i-mdi-share text-primary'} style={{fontSize: 37.5}} />
            <Text>邀请赚钱</Text>
          </View>
        </View>*/}

        <View className={'p-4 mx-3 mt-2 bg-white rounded-md grid grid-cols-3 gap-y-4'}>
          <Button className={'flex flex-col items-center'} fill={"none"} onClick={() => Taro.showToast({title: '功能陆续开放中', icon: 'none'})} style={{'--nutui-button-default-height': '66px'}}>
            <View className={'h-full flex flex-col items-center justify-center'}>
              <Text className={'i-material-symbols-light-favorite-outline-rounded text-4xl text-gray-500'} />
              <Text className={'text-gray-500 text-sm mt-1'}>我的关注</Text>
            </View>
          </Button>
          <Button className={'flex flex-col items-center'} fill={"none"} openType={"contact"} style={{'--nutui-button-default-height': '66px'}}>
            <View className={'h-full flex flex-col items-center justify-center'}>
              <Text className={'i-material-symbols-light-headset-mic-outline-sharp text-4xl text-gray-500'} />
              <Text className={'text-gray-500 text-sm mt-1'}>联系客服</Text>
            </View>
          </Button>
          <Button className={'flex flex-col items-center'} fill={"none"} onClick={() => Taro.makePhoneCall({phoneNumber: '19900001111'})} style={{'--nutui-button-default-height': '66px'}}>
            <View className={'h-full flex flex-col items-center justify-center'}>
              <Text className={'i-material-symbols-light-note-alt-outline-rounded text-4xl text-gray-500'} />
              <Text className={'text-gray-500 text-sm mt-1'}>反馈与投诉</Text>
            </View>
          </Button>
          <Button className={'flex flex-col items-center'} fill={"none"} onClick={() => Taro.navigateTo({url: '/pages/address/index'})} style={{'--nutui-button-default-height': '66px'}}>
            <View className={'h-full flex flex-col items-center justify-center'}>
              <Text className={'i-material-symbols-light-location-on-outline-rounded text-4xl text-gray-500'} />
              <Text className={'text-gray-500 text-sm mt-1'}>地址管理</Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
