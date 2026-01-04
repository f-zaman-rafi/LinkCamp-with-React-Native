import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, StyleProp, TextStyle } from 'react-native';

type ExpandableTextProps = {
  text?: string;
  step?: number;
  className?: string;
  buttonClassName?: string;
  textStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<TextStyle>;
};

const ExpandableText = ({
  text = '',
  step = 250,
  className = 'text-[15px] leading-5',
  buttonClassName = 'mt-1 text-right text-xs font-semibold',
  textStyle,
  buttonStyle,
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
      <Text className={className} style={textStyle}>
        {displayText}
        {canExpand ? '...' : ''}
      </Text>

      {total > step ? (
        <TouchableOpacity onPress={handleToggle}>
          <Text className="mt-1" style={[buttonStyle, { textAlign: 'right' }]}>
            {canExpand ? 'See more...' : '...See less'}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default ExpandableText;
