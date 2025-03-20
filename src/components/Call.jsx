import React from 'react';
import {Text, View} from "@tarojs/components";
import {Image, Popup, Swiper} from "@nutui/nutui-react-taro";
import {ASSET_DOMAIN} from "../utils/const";
import api from "../utils/api";
import Taro from "@tarojs/taro";

const Call = ({id, setId}) => {
  const [banners, setBanners] = React.useState([]);
  const [mobiles, setMobiles] = React.useState([]);

  React.useEffect(() => {
    id > 0 && init();
  }, [id]);

  async function init(){
    const [res, res2] = await Promise.all([
      api.get('/advertiser/scene', {scene: 6}),
      api.get('/user/'+id),
    ]);
    setBanners(res.list);
    setMobiles(res2.data.mobiles);
  }

  async function makePhoneCall(mobile){
    await Taro.makePhoneCall({
      phoneNumber: mobile,
    });
  }

  return (
    <Popup visible={id > 0} onClose={() => setId(0)} position={"center"} style={{background: 'transparent'}}>
      <View className={'w-70'}>
        <Swiper autoplay interval={3000} indicator={false} height={140} className={'bg-white rounded-t-md'}>
          {banners.map(item => <Swiper.Item key={item.id}><Image src={ASSET_DOMAIN+item.image} /></Swiper.Item>)}
        </Swiper>
        <View className={'bg-white rounded-b-md'}>
          {mobiles?.map((item, index) => <View id={item.mobile} className={['flex items-center justify-center py-3 text-lg border-solid border-gray-100', index !== 0 && 'border-t'].join(' ')} onClick={() => makePhoneCall(item.mobile)}>
            <Text>{item.name}</Text>
            <Text className={'text-primary mx-2'}>{item.mobile}</Text>
            <Text className={'i-ph-phone-call-fill text-primary text-2xl'} />
          </View>)}
        </View>
      </View>
    </Popup>
  );
};

export default Call;
