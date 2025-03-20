import React from 'react';
import {Button, Popup} from "@nutui/nutui-react-taro";
import api from "../utils/api";
import {ScrollView, Text, View} from "@tarojs/components";
import Taro, {useDidShow} from "@tarojs/taro";
import {UserContext} from "../utils/const";
import {onGetPhoneNumber} from "../utils/helper";
import EmptyPlaceholder from "./EmptyPlaceholder";

const PickerAddress = ({id, setId, onSubmit, title = '选择地址'}) => {
  const [user, setUser] = React.useContext(UserContext);
  const [refreshed, setRefreshed] = React.useState(false);
  const [list, setList] = React.useState([]);

  useDidShow(() => {
    id > 0 && init();
  })

  React.useEffect(() => {
    id > 0 && init();
  }, [id]);

  async function init(){
    const res = await api.get('/address', {rows: 99999});
    setList(res.list.data);
  }

  function submit(id){
    onSubmit && onSubmit(id);
    setId(0);
  }

  async function refresh(){
    setRefreshed(true);
    await init();
    setRefreshed(false);
  }

  return (
    <Popup visible={id > 0} onClose={() => setId(0)} round={true} position={"bottom"} title={title}>
      <ScrollView scrollY={true} refresherEnabled={true} refresherTriggered={refreshed} onRefresherRefresh={() => refresh()} className={'h-90'}>
        {list.length > 0 ? list.map(item => <View key={item.id} className={'border-b border-solid border-gray-100 p-4'} onClick={() => submit(item.id)}>
          <View className={'flex items-center'}><Text className={'i-fa-regular-address-book'} /><Text className={'ml-1 text-sm font-bold'}>{item.contact}</Text></View>
          <Text className={'text-sm'}>{item.tel}</Text>
          <View><Text className={'text-sm text-gray-500'}>{item.address}</Text></View>
        </View>) : <EmptyPlaceholder />}
      </ScrollView>
      <View className={'my-2 mx-3'}>
        {user ? <Button block size={"large"} type={"primary"} onClick={() => Taro.navigateTo({url: '/pages/address/index'})}>地址管理</Button> : <Button block size={"large"} type={"primary"} openType={"getPhoneNumber"} onGetPhoneNumber={e => onGetPhoneNumber(e).then(user => setUser(user)).then(() => Taro.navigateTo({url: '/pages/address/index'}))}>地址管理</Button>}
      </View>
    </Popup>
  );
};

export default PickerAddress;
