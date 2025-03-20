import React from 'react';
import {ScrollView, Text, View} from "@tarojs/components";
import {Button, Checkbox, Dialog, Space} from "@nutui/nutui-react-taro";
import Taro, {useDidShow} from "@tarojs/taro";
import api from "../../utils/api";

const Index = () => {
  const [list, setList] = React.useState([]);
  const [refreshed, setRefreshed] = React.useState(false);
  const pageRef = React.useRef(1);

  useDidShow(() => {
    pageRef.current = 1;
    init();
  });

  async function init(){
    const res = await api.get('/address', {page: pageRef.current});
    pageRef.current === 1 ? setList(res.list.data) : setList([...list, res.list.data]);
    pageRef.current++;
  }

  async function del(id){
    Dialog.open('confirm', {
      title: '确定删除',
      content: `确认删除此地址`,
      onConfirm: async () => {
        await api.delete('/address/'+id);
        await refresh();
        Taro.showToast({title: '已删除地址'});
        Dialog.close('confirm');
      },
      onCancel: () => Dialog.close('confirm'),
    })
  }

  async function refresh(){
    setRefreshed(true);
    pageRef.current = 1;
    await init();
    setRefreshed(false);
  }

  return (
    <View className={'flex flex-col h-screen'}>
      <ScrollView scrollY={true} refresherEnabled={true} refresherTriggered={refreshed} onRefresherRefresh={() => refresh()} className={'flex-1 overflow-scroll'}>
        {list.map(item => <View className={'mx-3 p-3 mt-2 rounded-md bg-white'}>
          <View className={'flex items-center'}><Text>{item.contact}</Text><Text className={'ml-2'}>{item.tel}</Text></View>
          <View className={'my-2'}><Text className={'text-sm text-gray-500'}>{item.address}</Text></View>
          <View className={'border-t border-solid border-gray-100 flex items-center justify-between pt-2'}>
            <Checkbox checked={item.default} icon={<Text className={'i-material-symbols-light-circle-outline'} />} activeIcon={<Text className={'i-ep-success-filled text-primary'} />}>是否默认</Checkbox>
            <Space style={{'--nutui-space-gap': '14px'}}>
              <View onClick={() => del(item.id)}><Text className={'text-sm text-red-500'}>删除</Text></View>
              <View onClick={() => Taro.navigateTo({url: 'edit?id='+item.id})}><Text className={'text-sm text-primary'}>编辑</Text></View>
            </Space>
          </View>
        </View>)}
      </ScrollView>
      <View className={'px-4 pt-2 pb-8'}>
        <Button type={"primary"} shape={"round"} block={true} size={"large"} onClick={() => Taro.navigateTo({url: 'edit?id=0'})}>新增地址</Button>
      </View>

      <Dialog id={'confirm'} />
    </View>
  );
};

export default Index;
