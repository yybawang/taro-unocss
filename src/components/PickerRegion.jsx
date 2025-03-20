import React from 'react';
import {PickerView, PickerViewColumn, ScrollView, Text, View} from "@tarojs/components";
import {Button, Popup, SearchBar} from "@nutui/nutui-react-taro";
import api from "../utils/api";

const PickerRegion = ({visible, setVisible, onSubmit}) => {
  const [value, setValue] = React.useState([0, 0, 0]);
  const [provinces, setProvinces] = React.useState([]);
  const [cities, setCities] = React.useState([]);
  const [districts, setDistricts] = React.useState([]);
  const [keyword, setKeyword] = React.useState('');
  const [list, setList] = React.useState([]);

  React.useEffect(() => {
    getChildren();
  }, [value]);

  async function getChildren(){
      const province = await api.get('/region/children', {pid: 0});
      const city = await api.get('/region/children', {pid: province.list[value[0]]?.id});
      const district = await api.get('/region/children', {pid: city.list[value[1]]?.id});
      setProvinces(province.list);
      setCities(city.list);
      setDistricts(district.list);
  }

  async function search(){
    if(!keyword){
      setList([]);
      return;
    }
    const res = await api.get('/region/search', {keyword});
    setList(res.list);
  }

  function submit(id){
    setVisible(false);
    onSubmit(id);
  }

  return (
    <Popup visible={visible} onClose={() => setVisible(false)} round={true} position={"bottom"} title={'选择地区'} closeable={true} closeIcon={<View className={'w-8 text-primary'}>确定</View>} onCloseIconClick={() => submit(districts[value[2]]?.id)}>
      <SearchBar value={keyword} onChange={setKeyword} leftIn={<Text className={'i-mdi-search text-lg'} />} right={<Button size={"small"} fill={"none"} onClick={() => search()}>搜索</Button>} />
      {list.length > 0 ? <ScrollView scrollY={true} className={'h-80'}>
        {list.map(item => <View key={item.id} onClick={() => submit(item.id)} className={'py-4 px-4 border-b border-solid border-gray-100 hover:opacity-50'}>{item.name}</View>)}
      </ScrollView>
        : <PickerView value={value} onChange={e => setValue(e.detail.value)} className={'h-80 px-4'}>
        <PickerViewColumn>{provinces.map(item => <View key={item.id}>{item.name}</View>)}</PickerViewColumn>
        <PickerViewColumn>{cities.map(item => <View key={item.id}>{item.name}</View>)}</PickerViewColumn>
        <PickerViewColumn>{districts.map(item => <View key={item.id}>{item.name}</View>)}</PickerViewColumn>
      </PickerView>}
    </Popup>
  );
};

export default PickerRegion;
