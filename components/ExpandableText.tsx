import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type ExpandableTextProps = {
  text?: string;
  step?: number;
  className?: string;
  buttonClassName?: string;
};

const ExpandableText = ({
  text = '',
  step = 250,
  className = 'text-[15px] leading-5 text-slate-900',
  buttonClassName = 'mt-1 text-right text-xs font-semibold text-blue-600',
}: ExpandableTextProps) => {
  const [visibleChars, setVisibleChars] = useState(step);

  useEffect(() => {
    setVisibleChars(step);
  }, [text, step]);

  if (!text) return null;

  const total = text.length;
  const displayText = text.slice(0, visibleChars);
  const canExpand = visibleChars < total;

  const handleToggle = () => {
    if (canExpand) {
      setVisibleChars((prev) => Math.min(prev + step, total));
    } else if (total > step) {
      setVisibleChars(step);
    }
  };

  return (
    <View>
      <Text className={className}>
        {displayText}
        {canExpand ? '...' : ''}
      </Text>

      {total > step ? (
        <TouchableOpacity onPress={handleToggle}>
          <Text className={buttonClassName}>{canExpand ? 'See more...' : '...See less'}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default ExpandableText;
