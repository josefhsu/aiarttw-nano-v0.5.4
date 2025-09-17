import React, { useState, useRef, useCallback } from 'react';
import type { ImageCompareElement } from '../types';
import { ChevronsLeftRight } from 'lucide-react';

interface ImageCompareProps {
  element: ImageCompareElement;
}

export const ImageCompare: React.FC<ImageCompareProps> = ({ element }) => {
  const [mode, setMode] = useState<'slider' | 'result'>('slider');
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (mode !== 'slider' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, [mode]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
      // In slider mode, stop propagation to prevent TransformableElement from moving the component.
      // This allows the slider to be controlled by mouse movement without dragging the whole element.
      if (mode === 'slider') {
          e.stopPropagation();
      }
  };
  
  const { srcBefore, srcAfter } = element;

  return (
    <div className="w-full h-full relative select-none flex flex-col bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-black/60 p-1 rounded-full flex text-xs">
        <button
          onClick={(e) => { e.stopPropagation(); setMode('result'); }}
          className={`px-3 py-1 rounded-full ${mode === 'result' ? 'bg-gray-600 text-white' : 'text-gray-300'}`}
        >
          Result
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setMode('slider'); }}
          className={`px-3 py-1 rounded-full ${mode === 'slider' ? 'bg-orange-500 text-white' : 'text-gray-300'}`}
        >
          Slider
        </button>
      </div>

      {mode === 'slider' ? (
        <div 
          ref={containerRef} 
          className="relative w-full h-full cursor-ew-resize overflow-hidden" 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        >
          <img
            src={srcBefore}
            alt="Before"
            className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
            draggable={false}
          />
          <div
            className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={srcAfter}
              alt="After"
              className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
              draggable={false}
            />
          </div>
          <div
            className="absolute top-0 bottom-0 w-1 bg-orange-500 pointer-events-none cursor-ew-resize"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
              <ChevronsLeftRight size={16} className="text-white" />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-full">
            <img
              src={srcAfter}
              alt="Result"
              className="w-full h-full object-contain pointer-events-none"
              draggable={false}
            />
        </div>
      )}
    </div>
  );
};