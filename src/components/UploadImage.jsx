import React from 'react';
import api from "../utils/api";
import {ASSET_DOMAIN} from "../utils/const";
import {Text} from "@tarojs/components";
import {Uploader} from "@nutui/nutui-react-taro";

const UploadImage = ({value, onChange, limit = 12}) => {
  const [files, setFiles] = React.useState([]);

  React.useEffect(() => {
    setFiles(value?.map(item => ({url: ASSET_DOMAIN+item, uid: item})) ?? []);
  }, [value]);

  function formatFiles(files){
    files.length > 0 && files.findIndex(item => item.url.indexOf(ASSET_DOMAIN) !== 0) === -1 && onChange && onChange(files.map(item => item.url.replace(ASSET_DOMAIN, '')));
  }

  return (
    <Uploader upload={file => api.upload(file.tempFilePath).then(url => ({url: ASSET_DOMAIN+url}))} onChange={files => formatFiles(files)} onDelete={(file) => setFiles([...files].filter(item => item.url !== file.url.substring(file.url.indexOf('/storage/'))))} value={files} multiple={limit > 1} maxCount={limit} uploadIcon={<Text className={'i-mdi-upload text-2xl'} />} deleteIcon={<Text className={'i-tdesign-close-circle text-red-500'} />} />
  );
};

export default UploadImage;
