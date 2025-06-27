import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3000/api/profanity-logs'; // Replace with actual API port
const API_KEY = 'b53abdf6659c147bfd405e701b50b2b40d977ea6b8bae8e7116ebda20ae02b0a787d0f78e493109de36ddb2d1268d8c4d2c665306964f1665ce99702f134258a';

function countProfanities(logs) {
  const freq = {};
  logs.forEach(log => {
    const word = log.detected_profanity;
    if (word) freq[word] = (freq[word] || 0) + 1;
  });
  return freq;
}

function getFontSize(count, min, max, minSize = 16, maxSize = 48) {
  if (max === min) return (minSize + maxSize) / 2;
  return minSize + ((count - min) * (maxSize - minSize)) / (max - min);
}

function getRandomColor(seed) {
  // Simple deterministic color generator based on word
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}

const WordCloud = () => {
  const [words, setWords] = useState([]);

  useEffect(() => {
    fetch(API_URL, {
      headers: { 'x-api-key': API_KEY }
    })
      .then(res => res.json())
      .then(data => {
        const freq = countProfanities(data);
        const wordArr = Object.entries(freq).map(([word, count]) => ({ word, count }));
        setWords(wordArr);
      });
  }, []);

  if (words.length === 0) return <div>Loading word cloud...</div>;

  const counts = words.map(w => w.count);
  const min = Math.min(...counts);
  const max = Math.max(...counts);

  // Responsive grouped layout with dynamic margin based on font size
  const groupWidth = '100%';
  const groupHeight = '100%';
  const minContainerWidth = '100%';
  const minContainerHeight = 600;
  const centerX = 300;
  const centerY = 100;
  const baseRadius = 35;
  const stepRadius = 22;
  const wordWidth = 50;
  const wordHeight = 24;

  return (
    <div style={{ width: groupWidth, height: groupHeight, minWidth: minContainerWidth, minHeight: minContainerHeight, borderRadius: 12, margin: 'auto', overflow: 'hidden' }}>
      {words.map(({ word, count }, i) => {
        const group = Math.floor(Math.sqrt(i));
        const posInGroup = i - group * group;
        // Dynamic wordsInGroup and radius step based on font size
        const fontSize = getFontSize(count, min, max, 18, 48);
        // Increase margin and radius step for more space between words
        const dynamicMargin = Math.max(50, Math.round(fontSize * 0.5));
        const dynamicPadding = `0 ${Math.round(fontSize * 0.5)}px`;
        const wordsInGroup = Math.max(8, group * 8 + 8); // fewer words per group for more angular space
        const angle = (2 * Math.PI * posInGroup) / wordsInGroup + (group % 2 === 0 ? 0 : Math.PI / wordsInGroup);
        const radius = baseRadius + group * (stepRadius + dynamicMargin +20); // larger step for more radial space
        const x = centerX + radius * Math.cos(angle) - wordWidth / 2;
        const y = centerY + radius * Math.sin(angle) - wordHeight / 2;
        return (
          <span
            key={word}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              fontSize,
              color: getRandomColor(word),
              fontWeight: 'bold',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              textShadow: '1px 1px 2px #fff, 0 0 2px #ccc',
              padding: dynamicPadding,
              borderRadius: 6,
              boxSizing: 'border-box',
              margin: `${dynamicMargin}px`
            }}
            title={`Count: ${count}`}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

export default WordCloud;
