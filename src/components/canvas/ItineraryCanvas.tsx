'use client';
import { useState } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { Button } from '@/components/ui/Button';

interface CanvasItem {
  id: string;
  x: number;
  y: number;
  content: string;
}

export function ItineraryCanvas() {
  const [items, setItems] = useState<CanvasItem[]>([]);

  const handleDragEnd = (e: any, index: number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], x: e.target.x(), y: e.target.y() };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), x: 50, y: 50, content: 'New Item' }]);
  };

  return (
    <div className="p-4">
      <Stage width={800} height={600} className="border">
        <Layer>
          {items.map((item, i) => (
            <Rect
              key={item.id}
              x={item.x}
              y={item.y}
              width={100}
              height={50}
              fill="lightblue"
              draggable
              onDragEnd={(e) => handleDragEnd(e, i)}
            />
          ))}
        </Layer>
      </Stage>
      <Button onClick={addItem} className="mt-4">
        Add Item
      </Button>
    </div>
  );
}   