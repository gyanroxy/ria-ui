'use client';

import React, { useState } from 'react';
import { TranscriptTurn } from '@/types';
import { useApp } from '@/context/AppContext';

interface AudioTranscriptProps {
  turns: TranscriptTurn[];
  audioFile: string;
}

export default function AudioTranscript({ turns, audioFile }: AudioTranscriptProps) {
  const { showToast } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<number | null>(null);

  const handlePlayTTS = (txt: string, lang: string, index: number) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(txt);
      u.rate = 0.95;
      if (lang === 'te') u.lang = 'te-IN';
      else if (lang === 'hi') u.lang = 'hi-IN';
      else if (lang === 'ta') u.lang = 'ta-IN';
      else if (lang === 'kn') u.lang = 'kn-IN';
      else u.lang = 'en-IN';

      u.onstart = () => {
        setIsPlaying(true);
        setCurrentTurn(index);
      };
      u.onend = () => {
        setIsPlaying(false);
        setCurrentTurn(null);
      };
      u.onerror = () => {
        setIsPlaying(false);
        setCurrentTurn(null);
      };
      window.speechSynthesis.speak(u);
    } else {
      showToast('Playing simulated audio recording...');
    }
  };

  const handlePlayFull = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      let i = 0;
      const playNext = () => {
        if (i >= turns.length) {
          setIsPlaying(false);
          setCurrentTurn(null);
          return;
        }
        const t = turns[i];
        const u = new SpeechSynthesisUtterance(t.txt);
        u.rate = 1.0;
        if (t.lang === 'te') u.lang = 'te-IN';
        else if (t.lang === 'hi') u.lang = 'hi-IN';
        else u.lang = 'en-IN';

        u.onstart = () => {
          setIsPlaying(true);
          setCurrentTurn(i);
        };
        u.onend = () => {
          i++;
          playNext();
        };
        u.onerror = () => {
          setIsPlaying(false);
          setCurrentTurn(null);
        };
        window.speechSynthesis.speak(u);
      };
      playNext();
    } else {
      showToast(`Playing audio stream: ${audioFile}`);
    }
  };

  const handleStop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setCurrentTurn(null);
  };

  return (
    <div className="card">
      <div className="card-h">
        <h3>Call Transcript & Vernacular Audio</h3>
        <span className="sub">{turns.length} turns recorded · Sub-second latency</span>
        <div className="r">
          {!isPlaying ? (
            <button className="btn btn-primary btn-sm" onClick={handlePlayFull}>
              ▶ Play Full Audio Stream
            </button>
          ) : (
            <button className="btn btn-red btn-sm" onClick={handleStop}>
              ⏹ Stop Audio
            </button>
          )}
        </div>
      </div>
      <div className="card-b">
        <div className="transcript">
          {turns.map((t, idx) => {
            const isRia = t.who.toUpperCase() === 'RIA';
            const isSpeakingThis = currentTurn === idx;

            return (
              <div
                key={idx}
                className={`turn ${isRia ? 'ria' : ''}`}
                style={{
                  background: isSpeakingThis ? 'var(--blue-soft)' : 'transparent',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  transition: 'background .15s',
                }}
              >
                <div>
                  <div className="who">{t.who}</div>
                  <div className="lang">{t.lang.toUpperCase()}</div>
                </div>
                <div>
                  <div className="txt">{t.txt}</div>
                  <div style={{ marginTop: '4px' }}>
                    <button
                      className="btn btn-ghost"
                      style={{ padding: '2px 8px', fontSize: '11px', borderRadius: '4px' }}
                      onClick={() => handlePlayTTS(t.txt, t.lang, idx)}
                    >
                      🔊 Listen turn
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
