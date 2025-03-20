import React from 'react';
import {Text, View} from "@tarojs/components";
import {Empty} from "@nutui/nutui-react-taro";

const EmptyPlaceholder = ({iconName = 'i-material-symbols-light-note-outline', title = <Text className={'text-gray-500'}>暂无数据</Text>}) => {

  return (
    <Empty image={<View className={'h-full flex flex-col items-center justify-center'}><Text className={[iconName, 'text-gray-300 text-8xl'].join(' ')} /></View>} title={title} />
  );
};

export default EmptyPlaceholder;
