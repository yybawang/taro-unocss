import React from 'react';
import {Input, Text, View} from "@tarojs/components";
import {Avatar, Button, Cell, TextArea, Popup} from "@nutui/nutui-react-taro";
import logo from '../../images/logo.png';
import {UserContext} from "../../utils/const";
import api from "../../utils/api";
import {useImage} from "taro-hooks";
import Taro from "@tarojs/taro";
import storage from "../../utils/storage";
import PickerImage from "../../components/PickerImage";

const Info = () => {
  const [user, setUser] = React.useContext(UserContext);
  const [fileInfo, {choose, preview}] = useImage();
  const [nameVisible, setNameVisible] = React.useState(false);
  const [name, setName] = React.useState('');
  const [noticeVisible, setNoticeVisible] = React.useState(false);
  const [notice, setNotice] = React.useState('');
  const [descriptionVisible, setDescriptionVisible] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [descriptionImagesVisible, setDescriptionImagesVisible] = React.useState(false);
  const [descriptionImages, setDescriptionImages] = React.useState([]);

  React.useMemo(() => {
    setName(user?.name);
    setNotice(user?.notice);
    setDescription(user?.description);
    setDescriptionImages(user?.description_images);
  }, [nameVisible, noticeVisible, descriptionVisible, descriptionImagesVisible]);

  async function getAvatar(e){
    const file = e.detail.avatarUrl;
    const avatar = await api.upload(file);
    await api.post('/user/basic', {avatar});
    setUser({...user, avatar});
    Taro.showToast({icon: 'success', title: '修改成功'});
  }

  async function getPoster(){
    const res = await choose({count: 1});
    for(const tempPath of res.tempFilePaths){
      const poster = await api.upload(tempPath);
      await api.post('/user/basic', {poster});
      setUser({...user, poster});
      Taro.showToast({icon: 'success', title: '修改成功'});
    }
  }

  async function getDescriptionImages(files){
    // const res = await choose();
    // const images = [];
    // for(const tempPath of res.tempFilePaths){
    //   const image = await api.upload(tempPath);
    //   images.push(image);
    // }
    // await api.post('/user/basic', {description_images: images});
    // setUser({...user, description_images: images});
    // Taro.showToast({icon: 'success', title: '修改成功'});
    for (const file of files){
      if(file.status !== 'success'){
        continue;
      }
      setDescriptionImages([...descriptionImages ?? [], file.url]);
    }
  }

  async function submitBasic(param){
    await api.post('/user/basic', param);
    setUser({...user, ...param});
    setNameVisible(false);
    setNoticeVisible(false);
    setDescriptionVisible(false);
    setDescriptionImagesVisible(false);
    Taro.showToast({icon: 'success', title: '修改成功'});
  }

  async function logout(){
    storage.removeSync('token');
    setUser(null);
    Taro.navigateBack();
  }

  return (
    <View>
      <Cell.Group title={'基本信息'}>
        <Cell title={'我的头像'} align={"center"} extra={<Button fill={"none"} openType={"chooseAvatar"} onChooseAvatar={getAvatar} className={'flex items-center'}>
          <Avatar src={user?.avatar ? user.avatar : logo} shape={"round"} size={30} background={'lightgray'} />
          <Text className={'i-iconamoon-arrow-right-2-light text-2xl'} />
        </Button>} />
        <Cell title={'我的昵称'} align={"center"} extra={<View className={'flex items-center'} onClick={() => setNameVisible(true)}>
          <Text className={'text-gray-500'}>{user?.name}</Text>
          <Text className={'i-iconamoon-arrow-right-2-light text-2xl'} />
        </View>} />
      </Cell.Group>

      {/*物流商信息修改*/}
      {!!user?.merchant && <Cell.Group title={'物流商资料'}>
        <Cell title={'门店联系方式'} align={'center'} onClick={() => Taro.navigateTo({url: '/pages/more/mobile'})} extra={<View className={'flex items-center'}>
          <Text className={'text-gray-500'}>{user?.mobiles?.length ?? 0}个</Text>
          <Text className={'i-iconamoon-arrow-right-2-light text-2xl'} />
        </View>}></Cell>
        <Cell title={'门店招牌图'} align={'center'} onClick={() => getPoster()} extra={<View className={'flex items-center'}>
          <Avatar src={user?.poster ? user.poster : ''} shape={"square"} size={30} background={'lightgray'} />
          <Text className={'i-iconamoon-arrow-right-2-light text-2xl'} />
        </View>}></Cell>
        <Cell title={'店铺公告'} align={'center'} onClick={() => setNoticeVisible(true)} extra={<View className={'flex items-center'}>
          <Text className={'text-gray-500'}>{user?.notice.substring(0, 8)}</Text>
          <Text className={'i-iconamoon-arrow-right-2-light text-2xl'} />
        </View>}></Cell>
        <Cell title={'店铺详情描述'} align={'center'} onClick={() => setDescriptionVisible(true)} extra={<View className={'flex items-center'}>
          <Text className={'text-gray-500'}>{user?.description.substring(0, 8)}</Text>
          <Text className={'i-iconamoon-arrow-right-2-light text-2xl'} />
        </View>}></Cell>
        <Cell title={'店铺详情图片'} align={'center'} onClick={() => setDescriptionImagesVisible(true)} extra={<View className={'flex items-center'}>
          <Avatar.Group max={5}>
            {user?.description_images?.map(item => <Avatar key={item} src={item} shape={"round"} size={30} background={'lightgray'} />)}
          </Avatar.Group>
          <Text className={'i-iconamoon-arrow-right-2-light text-2xl'} />
        </View>}></Cell>
      </Cell.Group>}

      <View className={'mx-3 mt-8'}><Button size={"large"} block onClick={() => logout()}>退出登录</Button></View>




      <Popup visible={nameVisible} onClose={() => setNameVisible(false)} closeOnOverlayClick={false} closeable={true} closeIcon={<Text className={'i-mdi-close text-gray-400'} />} title={'修改昵称'} position={"bottom"} style={{height: '100rpx'}}>
        <View className={'mt-5 mx-4'}>
          <Input type={'nickname'} confirmType={'done'} focus={true} value={name} onInput={e => setName(e.detail.value)} placeholder={'输入新昵称'} className={'py-3 px-2 rounded border border-solid border-gray-200'} />
        </View>
        <View className={'mt-4 mx-4'}>
          <Button type={"primary"} block={true} onClick={() => submitBasic({name})}>提交修改</Button>
        </View>
      </Popup>

      <Popup visible={noticeVisible} onClose={() => setNoticeVisible(false)} closeOnOverlayClick={false} closeable={true} closeIcon={<Text className={'i-mdi-close text-gray-400'} />} title={'修改店铺公告'} position={"bottom"} style={{height: '100rpx'}}>
        <View className={'mt-5 mx-4'}>
          <Input confirmType={'done'} focus={true} value={notice} onInput={e => setNotice(e.detail.value)} placeholder={'输入店铺公告'} className={'py-3 px-2 rounded border border-solid border-gray-200'} />
        </View>
        <View className={'mt-4 mx-4'}>
          <Button type={"primary"} block={true} onClick={() => submitBasic({notice})}>提交修改</Button>
        </View>
      </Popup>

      <Popup visible={descriptionVisible} onClose={() => setDescriptionVisible(false)} closeOnOverlayClick={false} closeable={true} closeIcon={<Text className={'i-mdi-close text-gray-400'} />} title={'修改店铺详情描述'} position={"bottom"} style={{height: '100rpx'}}>
        <View className={'mt-5 mx-4'}>
          <TextArea confirmType={'done'} focus={true} rows={3} value={description} onChange={setDescription} showCount maxLength={100} placeholder={'输入店铺详情描述'} className={'w-full py-3 px-2 rounded border border-solid border-gray-200'} />
        </View>
        <View className={'mt-4 mx-4'}>
          <Button type={"primary"} block={true} onClick={() => submitBasic({description})}>提交修改</Button>
        </View>
      </Popup>

      <PickerImage visible={descriptionImagesVisible} setVisible={setDescriptionImagesVisible} images={descriptionImages} onSubmit={val => submitBasic({description_images: val})} limit={12} />
    </View>
  );
};

export default Info;
