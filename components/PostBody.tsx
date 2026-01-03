import React from 'react';
import { View, Text, Image } from 'react-native';

type PostBodyProps = {
  content?: string;
  photo?: string;
  photoHeight?: number;
};

const PostBody = ({ content, photo, photoHeight = 220 }: PostBodyProps) => {
  return (
    <View>
      {content ? (
        <Text className="mt-2 text-[15px] leading-5 text-slate-900">{content}</Text>
      ) : null}
      {photo ? (
        <Image
          source={{ uri: photo }}
          style={{ width: '100%', height: photoHeight, borderRadius: 16, marginTop: 12 }}
        />
      ) : null}
    </View>
  );
};

export default PostBody;
