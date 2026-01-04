import React from 'react';
import { FlatList } from 'react-native';

type FeedListProps<T> = {
  data: T[];
  renderItem: ({ item }: { item: T }) => React.ReactElement | null;
  keyExtractor: (item: T) => string;
  refreshing: boolean;
  onRefresh: () => void;
  listEmptyComponent?: React.ReactElement;
  listRef?: React.RefObject<FlatList<T>>;
};

const FeedList = <T,>({
  data,
  renderItem,
  keyExtractor,
  refreshing,
  onRefresh,
  listEmptyComponent,
  listRef,
}: FeedListProps<T>) => {
  return (
    <FlatList
      ref={listRef}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={listEmptyComponent}
      contentContainerStyle={{ flexGrow: 1 }}
      contentInsetAdjustmentBehavior="never"
    />
  );
};

export default FeedList;
