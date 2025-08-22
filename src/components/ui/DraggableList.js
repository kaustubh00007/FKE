import React, { useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Paper, Typography, IconButton } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';

const initialItems = [
  { id: '1', content: 'Task 1: Complete project documentation', priority: 'high' },
  { id: '2', content: 'Task 2: Review code changes', priority: 'medium' },
  { id: '3', content: 'Task 3: Update dependencies', priority: 'low' },
  { id: '4', content: 'Task 4: Plan next sprint', priority: 'medium' },
];

const DraggableList = () => {
  const [items, setItems] = useState(initialItems);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(items);
    const [removed] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, removed);

    setItems(reorderedItems);
  }, [items]);

  const deleteItem = useCallback((id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <Paper elevation={2} className="p-4 max-w-md mx-auto animate-slide-in">
      <Typography variant="h6" className="mb-4 font-semibold">
        My Tasks
      </Typography>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="task-list">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-2 transition-colors duration-200 \${
                snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              {items.map(({ id, content, priority }, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`p-3 bg-white dark:bg-gray-800 border-l-4 \${getPriorityColor(priority)} 
                        rounded shadow-sm transition-all duration-200 \${
                        snapshot.isDragging 
                          ? 'transform rotate-2 shadow-lg' 
                          : 'hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          <div {...provided.dragHandleProps}>
                            <DragIndicatorIcon className="text-gray-400 cursor-grab" />
                          </div>
                          <Typography variant="body2" className="flex-1">
                            {content}
                          </Typography>
                        </div>
                        <IconButton
                          size="small"
                          onClick={() => deleteItem(id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Paper>
  );
};

export default DraggableList;