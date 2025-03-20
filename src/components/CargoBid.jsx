import React from 'react';
import {Audio, Button, Form, Input, Popup, TextArea} from "@nutui/nutui-react-taro";
import api from "../utils/api";
import Taro from "@tarojs/taro";
import {Text, View} from "@tarojs/components";
import RecordAudio from "./RecordAudio";
import {ASSET_DOMAIN} from "../utils/const";

const CargoBid = ({id, setId, onSubmit}) => {
  const [form] = Form.useForm();
  const [audioVisible, setAudioVisible] = React.useState(false);
  const [audio, setAudio] = React.useState('');

  async function submit(){
    await api.post('/cargo/bid', {...form.getFieldsValue(true), audio, cargo_id: id});
    Taro.showToast({title: '已成功报价'});
    onSubmit && onSubmit(id);
    setId(0);
    setAudio('');
    form.resetFields();
  }

  return (
    <Popup visible={id > 0} onClose={() => setId(0)} position={"bottom"} round={true} title={'报价'} style={{width: '100%'}}>
      <View className={'p-3'}>
        <Form form={form} onFinish={() => submit()} divider={true} footer={<Button size={"large"} block type={"primary"} nativeType={'submit'}>提交报价</Button>} style={{'--nutui-form-item-label-width' : '40px'}}>
          <Form.Item label={'报价金额'} name={'amount'}>
            <Input type={"digit"} placeholder={'请输入报价金额，单位元'} />
          </Form.Item>
          <Form.Item label={'留言'} name={'comment'}>
            <TextArea showCount={true} maxLength={100} placeholder={'给货主留言，货主选择报价的时候可供参考'} />
          </Form.Item>
          <Form.Item label={'语音留言'} name={'xxx'}>
            <View>
              <View className={'flex items-center justify-end'}><Button fill={"outline"} icon={<Text className={'i-famicons-mic'} />} onClick={() => setAudioVisible(true)}><Text>语音留言</Text></Button></View>
              {audio && <Audio src={ASSET_DOMAIN+audio} />}
            </View>
          </Form.Item>
        </Form>
      </View>

      <RecordAudio visible={audioVisible} setVisible={setAudioVisible} onSubmit={val => setAudio(val)} />
    </Popup>
  );
};

export default CargoBid;
