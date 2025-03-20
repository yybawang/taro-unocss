import React from 'react';
import {Text, View} from "@tarojs/components";
import {Button, Checkbox, Dialog, Form, Input, InputNumber, TextArea} from "@nutui/nutui-react-taro";
import api from "../../utils/api";
import Taro from "@tarojs/taro";

const Edit = () => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    init();
  }, []);

  async function init(){
    const params = Taro.getCurrentInstance().router.params;
    const res = await api.get('/address/'+params.id);
    form.setFieldsValue(res.data);
  }

  async function submit(){
    const res = await api.get('/region/geo', {address: form.getFieldValue('address')});
    Dialog.open('confirm', {
      title: '确定信息',
      content: <Text>智能解析地点为 <Text className="text-primary">{res.data.formatted_address}</Text>，确定为此区域吗？</Text>,
      onConfirm: async () => {
        await api.post('/address', form.getFieldsValue(true));
        Dialog.close('confirm');
        Taro.navigateBack();
      },
      onCancel: () => Dialog.close('confirm'),
    })
  }

  return (
    <View>
      <Form form={form} divider={true} onFinish={() => submit()} footer={<Button block type={"primary"} size={"large"} nativeType={"submit"}>保存</Button>}>
        <Form.Item label={'联系人'} name={'contact'}>
          <Input placeholder={'请输入联系人'} />
        </Form.Item>
        <Form.Item label={'联系电话'} name={'tel'}>
          <Input type={"number"} placeholder={'请输入联系电话'} />
        </Form.Item>
        {/*<Form.Item label={'选择地区'} name={'district_id'}>
          <View><Text className={'text-gray-500'}>请选择省/市/区</Text></View>
        </Form.Item>*/}
        <Form.Item label={'详细地址'} name={'address'}>
          <TextArea placeholder={'请输入省市区地址和详细楼号'} showCount maxLength={100} />
        </Form.Item>
        <Form.Item label={'默认'} name={'default'} valuePropName={'checked'}>
          <Checkbox icon={<Text className={'i-material-symbols-light-circle-outline text-lg'} />} activeIcon={<Text className={'i-ep-success-filled text-lg text-primary'} />}>设为默认</Checkbox>
        </Form.Item>
      </Form>

      <Dialog id={'confirm'} />
    </View>
  );
};

export default Edit;
