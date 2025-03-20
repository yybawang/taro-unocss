import React from 'react';
import {UserContext} from "../../utils/const";
import {useTabBar} from "taro-hooks";
import Taro, {useDidShow} from "@tarojs/taro";
import {ScrollView, Text, View} from "@tarojs/components";
import {wait} from "../../utils/helper";
import {Space} from "@nutui/nutui-react-taro";

const Index = () => {
  const [user, setUser, getUser] = React.useContext(UserContext);
  const [refreshed, setRefreshed] = React.useState(false);
  const tabBar = useTabBar();
  const pageRef = React.useRef(1);

  React.useEffect(() => {
    pageRef.current = 1;
    init();
  }, []);

  React.useEffect(() => {
    user?.unread_message && tabBar.toggleBadge({index: 0, text: '1'});
  }, [user]);

  async function init(){
    await wait(1000);
    Taro.showToast({title: `请求第 ${pageRef.current+1} 页结束`});
    pageRef.current++;
  }

  async function refresh(){
    setRefreshed(true);
    pageRef.current = 1;
    await init();
    setRefreshed(false);
  }

  return (
    <View className={'flex flex-col h-screen'}>
      <ScrollView scrollY={true} refresherEnabled={true} refresherTriggered={refreshed} onRefresherRefresh={() => refresh()} onScrollToLower={() => init()} enableBackToTop={true} className={'flex-1 overflow-scroll'}>
        <Space>
          <Text className={'text-green-500'}>Hello</Text>
          <Text className={'text-amber-500'}>World</Text>
        </Space>
      </ScrollView>
    </View>
  );
};

export default Index;
