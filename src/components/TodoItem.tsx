import { useState } from 'react';
import { Check, Trash2, Edit3, Save, X, Calendar, Flag } from 'lucide-react';
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || '');
  const [priority, setPriority] = useState(todo.priority);
  const [dueDate, setDueDate] = useState(
    todo.due_date ? new Date(todo.due_date).toISOString().split('T')[0] : ''
  );

  const handleSave = async () => {
    if (!title.trim()) return;
    
    await onUpdate(todo.id, {
      title: title.trim(),
      description: description.trim() || null,
      priority,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(todo.title);
    setDescription(todo.description || '');
    setPriority(todo.priority);
    setDueDate(todo.due_date ? new Date(todo.due_date).toISOString().split('T')[0] : '');
    setIsEditing(false);
  };

  const toggleComplete = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays <= 7) return `In ${diffDays} days`;
    
    return date.toLocaleDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const isOverdue = todo.due_date && new Date(todo.due_date) < new Date() && !todo.completed;

  return (
    <div className={`todo-item ${todo.completed ? 'todo-completed' : ''} ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Task title..."
          />
          
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
            placeholder="Description (optional)..."
          />
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-gray-500" />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="btn-primary text-sm flex items-center gap-1"
              disabled={!title.trim()}
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="btn-secondary text-sm flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-4">
            <button
              onClick={toggleComplete}
              className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                todo.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
              }`}
            >
              {todo.completed && <Check className="w-3 h-3" />}
            </button>
            
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {todo.title}
              </h3>
              
              {todo.description && (
                <p className={`text-sm mt-1 ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                  {todo.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 mt-3">
                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(todo.priority)}`}>
                  <Flag className="w-3 h-3" />
                  {todo.priority}
                </span>
                
                {todo.due_date && (
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                    isOverdue 
                      ? 'text-red-600 bg-red-100 border border-red-200' 
                      : 'text-blue-600 bg-blue-50 border border-blue-200'
                  }`}>
                    <Calendar className="w-3 h-3" />
                    {formatDate(todo.due_date)}
                  </span>
                )}
                
                <span className="text-xs text-gray-500">
                  {new Date(todo.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                title="Edit task"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onDelete(todo.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}