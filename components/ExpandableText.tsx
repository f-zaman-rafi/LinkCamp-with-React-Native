import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type ExpandableTextProps = {
  text?: string;
  step?: number;
  className?: string;
  buttonClassName?: string;
  initialExpanded?: boolean;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
};

const ExpandableText = ({
  text = '',
  step = 300,
  className = 'text-[15px] leading-5 text-slate-900',
  buttonClassName = 'mt-1 text-right text-xs font-semibold text-blue-600',
  initialExpanded = false,
  expanded,
  onToggle,
}: ExpandableTextProps) => {
  const [visibleChars, setVisibleChars] = useState(step);
  const [localExpanded, setLocalExpanded] = useState(initialExpanded);

  const isControlled = typeof expanded === 'boolean';
  const isExpanded = isControlled ? expanded : localExpanded;

  useEffect(() => {
    setVisibleChars(isExpanded ? text?.length || 0 : step);
  }, [isExpanded, step, text]);

  useEffect(() => {
    if (!text) {
      setVisibleChars(step);
      if (!isControlled) setLocalExpanded(false);
    }
  }, [text, step, isControlled]);

  if (!text) return null;

  const total = text.length;
  const isLong = total > step;
  const displayText = isExpanded ? text : text.slice(0, visibleChars);
  const showToggle = isLong;

  const toggle = () => {
    const next = !isExpanded;
    if (!isControlled) setLocalExpanded(next);
    onToggle?.(next);
  };

  return (
    <View>
      <Text className={className}>
        {displayText}
        {!isExpanded && isLong ? '...' : ''}
      </Text>

      {showToggle ? (
        <TouchableOpacity onPress={toggle}>
          <Text className={buttonClassName}>{isExpanded ? '...See less' : 'See more...'}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default ExpandableText;
