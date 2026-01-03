import React from 'react';
import { FlatList } from 'react-native';

type FeedListProps<T> = {
  data: T[];
  renderItem: ({ item }: { item: T }) => React.ReactElement | null;
  keyExtractor: (item: T) => string;
  refreshing: boolean;
  onRefresh: () => void;
  listEmptyComponent?: React.ReactElement;
};

const FeedList = <T,>({
  data,
  renderItem,
  keyExtractor,
  refreshing,
  onRefresh,
  listEmptyComponent,
}: FeedListProps<T>) => {
  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={listEmptyComponent}
    />
  );
};

export default FeedList;
