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



const LibWordCloud = () => {
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
  const groupWidth = '100%';
  const groupHeight = '100%';
  const minContainerWidth = '100%';
  const minContainerHeight = 600;




  // Build a text string for the word cloud API from the detected profanities
  const text = words.map(w => `${w.word} `.repeat(w.count)).join(' ').trim();
  const wordCloudUrl = `https://quickchart.io/wordcloud?text=${encodeURIComponent(text)}`;

  return (
    <div
      style={{
        width: groupWidth,
        height: groupHeight,
        minWidth: minContainerWidth,
        minHeight: minContainerHeight,
        margin: 'auto',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <iframe
        srcDoc={`<!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <title>Word Cloud</title>
              <style>
                html, body { height: 100%; width: 100%; margin: 0; padding: 0; background: transparent; }
                body { display: flex; justify-content: center; align-items: center; height: 100vh; }
                img { display: block; max-width: 100%; max-height: 100%; height: auto; width: auto; border-radius: 12px; border: 1px solid #ccc; object-fit: contain; }
              </style>
            </head>
            <body>
              <img src="${wordCloudUrl}" alt="Word Cloud"/>
            </body>
          </html>
        `}
        title="Word Cloud"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          minHeight: 400,
          minWidth: 400,
          background: 'transparent',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        loading="lazy"
      />
    </div>
  );
};

export default LibWordCloud;