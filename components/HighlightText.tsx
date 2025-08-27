import React from 'react';
import { Text, TextStyle } from 'react-native';

interface HighlightTextProps {
  text: string;
  highlight: string;
  style?: TextStyle;
  highlightStyle?: TextStyle;
}

const HighlightText: React.FC<HighlightTextProps> = ({ 
  text, 
  highlight, 
  style, 
  highlightStyle 
}) => {
  if (!highlight || !highlight.trim()) {
    return <Text style={style}>{text}</Text>;
  }

  // Escape special regex characters and create case-insensitive regex
  const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'));
  
  return (
    <Text style={style}>
      {parts.map((part, index) => {
        const isHighlighted = part.toLowerCase() === highlight.toLowerCase();
        const key = `${part}-${index}-${isHighlighted}`;
        
        return isHighlighted ? (
          <Text key={key} style={[style, highlightStyle]}>
            {part}
          </Text>
        ) : (
          <Text key={key}>{part}</Text>
        );
      })}
    </Text>
  );
};

export default HighlightText;
