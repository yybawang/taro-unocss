import React from 'react';
import {ScrollView, Text, View} from "@tarojs/components";
import {Button, Popup} from "@nutui/nutui-react-taro";
import UploadImage from "./UploadImage";

const PickerImage = ({visible, setVisible, images, onSubmit, limit = 12}) => {
  const [value, setValue] = React.useState([]);

  React.useEffect(() => {
    setValue(images ?? []);
  }, [images]);

  async function submit(){
    onSubmit && onSubmit(value);
    setVisible(false);
  }

  return (
    <Popup visible={visible} onClose={() => setVisible(false)} closeable={true} closeIcon={<Text className={'i-mdi-close text-gray-400'} />} title={'上传图片'} position={"bottom"}>
      <ScrollView scrollY={true} className={'h-80'}>
        <View className={'p-2'}>
        <UploadImage value={value} onChange={setValue} />
        </View>
      </ScrollView>
      <View className={'my-2 mx-3'}>
        <Button type={"primary"} block={true} size={"large"} onClick={() => submit()}>提交</Button>
      </View>
    </Popup>
  );
};

export default PickerImage;
