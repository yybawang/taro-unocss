import React from 'react';
import {ScrollView, Text, View} from "@tarojs/components";
import EmptyPlaceholder from "../../components/EmptyPlaceholder";
import {wait} from "../../utils/helper";
import api from "../../utils/api";
import dayjs from "dayjs";
import {Image} from "@nutui/nutui-react-taro";
import {UserContext} from "../../utils/const";
import Taro from "@tarojs/taro";

const Index = () => {
  const [user, setUser, getUser] = React.useContext(UserContext);
  const [list, setList] = React.useState([]);
  const [refreshed, setRefreshed] = React.useState(false);
  const pageRef = React.useRef(1);

  React.useEffect(() => {
    getUser();
    init();
  }, []);

  async function init(){
    const res = await api.get('/message', {page: pageRef.current});
    pageRef.current === 1 ? setList(res.list?.data ?? []) : setList([...list, res.list?.data ?? []]);
    pageRef.current++;
  }

  async function refresh(){
    setRefreshed(true);
    pageRef.current = 1;
    await getUser();
    await init();
    setRefreshed(false);
  }

  return (
    <View className={'flex flex-col h-screen'}>
      <ScrollView scrollY={true} refresherEnabled={true} refresherTriggered={refreshed} onRefresherRefresh={() => refresh()} className={'flex-1 overflow-screen'}>
        <View className={'py-1 bg-gray-100'} />
        {list.length > 0 ? list.map(item => <View key={item.id} className={'mx-2 p-3 mb-2 bg-white rounded-md'} onClick={() => item.data.url && Taro.navigateTo({url: item.data.url})}>
          <View className={'flex items-center justify-between py-2'}>
            <Text>{item.data.title}</Text>
            <Text className={'text-xs text-gray-500'}>{dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss')}</Text>
          </View>
          <View className={'flex'}>
            <View className={'w-16 h-16 bg-gray-300 rounded-md'}>{item.data.image ? <Image src={item.data.image} mode={"aspectFill"} className={'rounded-md'} /> : <View className={'h-full flex flex-col items-center justify-center'}><Text className={'i-material-symbols-light-delivery-truck-speed-outline-rounded text-4xl'} /></View>}</View>
            <View className={'ml-2 flex-1 flex flex-col justify-between'}>
              <View className={'text-gray-500 text-sm'}><Text>{item.data.content}</Text></View>
              {item.data.url && <View className={'flex justify-end'}><Text className={'text-xs text-gray-500'}>查看详情 &gt;</Text></View>}
            </View>
          </View>
        </View>) : <View>
          <EmptyPlaceholder iconName={'i-bx-message'} title={<Text className={'text-gray-500'}>暂无消息</Text>} />
        </View>}
        <View className={'py-1 bg-gray-100'} />
      </ScrollView>
    </View>
  );
};

export default Index;
