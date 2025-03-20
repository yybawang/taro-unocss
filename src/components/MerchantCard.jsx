import React from 'react';
import {Text, View} from "@tarojs/components";
import {Dialog, Image, Popup, Swiper} from "@nutui/nutui-react-taro";
import {ASSET_DOMAIN} from "../utils/const";
import logo from '../images/logo.png';
import Taro from "@tarojs/taro";
import api from "../utils/api";
import Call from "./Call";

const MerchantCard = ({user}) => {
  const [callId, setCallId] = React.useState(0);

  async function openLocation(item){
    await Taro.openLocation({
      longitude: Number(item.lng),
      latitude: Number(item.lat),
      name: user.name,
      address: item.address,
    });
  }



  return (
    <View className={'p-2 bg-white rounded-md'}>
      <View className={'flex items-stretch'}>
        <View className={'w-20 h-20'} onClick={() => Taro.navigateTo({url: '/pages/merchant/index?id='+user.id})}><Image src={user.poster ? ASSET_DOMAIN+user.poster : logo} /></View>
        <View className={'flex-1'} onClick={() => Taro.navigateTo({url: '/pages/merchant/index?id='+user.id})}>
          <Text className={'font-bold'}>{user.name}</Text>
          <View className={'mt-1 h-12 overflow-hidden flex flex-wrap'}>
            <Text className={'text-amber-600'}>南康</Text>
            <View className={'-mt-0.6 w-6 h-6 mx-1'}><Text className={'i-tdesign-swap-right text-2xl text-amber-600'} /></View>
            {user.logistics_lines?.map(item => <Text key={item.id} className={'mr-2 text-gray-500'}>{item.region_name}</Text>)}
          </View>
        </View>
        <View className={'flex flex-col justify-center'} onClick={() => setCallId(user.id)}><Text className={'i-bx-phone-call text-3xl text-primary'} /></View>
      </View>
      {/*物流商门店地址列表*/}
      <View className={'mt-1'}>
        {user.addresses?.map(item => <View key={item.id} className={'flex items-center'} onClick={() => openLocation(item)}>
          <View className={'border border-solid border-amber-600 px-0.5 rounded'}><Text className={'text-2.5 p-0 h-4 block text-amber-600'}>发站</Text></View>
          <View className={'flex-1 mx-2 truncate'}><Text className={'text-right'}>{item.address}</Text></View>
          <View className={'flex items-center'}><Text className={'i-mynaui-send-solid text-primary'} /><Text></Text><Text className={'text-primary text-sm'}>去导航</Text></View>
        </View>)}
      </View>

      <Call id={callId} setId={setCallId}></Call>
    </View>
  );
};

export default MerchantCard;
