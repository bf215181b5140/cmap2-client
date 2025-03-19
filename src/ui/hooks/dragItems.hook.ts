import { DragEvent, useState } from 'react';

export default function useDragItems<T extends { id: string; order: number; }>() {

  const [draggedItem, setDraggedItem] = useState<T | null>(null);
  // const [draggedOverItem, setDraggedOverItem] = useState<Item | null>(null);

  // Handler for drag start
  function handleDragStart(event: DragEvent<HTMLDivElement>, item: T) {
    event.stopPropagation();
    setDraggedItem(item);
    event.dataTransfer.effectAllowed = 'move';
  }

  // Handler for drag end
  function handleDragEnd(event: DragEvent<HTMLDivElement>, item: T) {
    event.stopPropagation();
    // setDraggedOverItem(null);
    event.preventDefault();
  }

  // Handler for drag over (prevents default behavior)
  function handleDragOver(event: DragEvent<HTMLDivElement>, item: T) {
    event.stopPropagation();
    // setDraggedOverItem(item)
    event.preventDefault();
  }

  // Handler for drop event
  function handleDrop(event: DragEvent<HTMLDivElement>, item: T, handleChange: (item: T, replacingItem: T) => void) {
    event.stopPropagation();
    event.preventDefault();

    if (draggedItem === null) return;

    if (draggedItem.id === item.id) {
      setDraggedItem(null);
      return;
    }

    handleChange(draggedItem, item);
    setDraggedItem(null);

    // Get new order of buttons
    // const newButtons = buttons
    //   .map((button) => {
    //     if (button.id === draggedItem.id) {
    //       return { ...button, order: targetButton.order };
    //     }
    //     if (button.id === targetButton.id) {
    //       return { ...button, order: draggedItem.order };
    //     }
    //     return button;
    //   })
    //   .sort((a, b) => a.order - b.order);
    //
    // setButtons(newButtons);

  }

  function dragProps(item: T, handleChange: (item: T, replacingItem: T) => void) {
    return {
      draggable: true,
      onDragStart: (event: DragEvent<HTMLDivElement>) => handleDragStart(event, item),
      onDragEnd: (event: DragEvent<HTMLDivElement>) => handleDragEnd(event, item),
      onDragOver: (event: DragEvent<HTMLDivElement>) => handleDragOver(event, item),
      onDrop: (event: DragEvent<HTMLDivElement>) => handleDrop(event, item, handleChange)
    };
  }

  return dragProps;
}