import { useState } from 'react';
import { Plus, Calendar, Flag } from 'lucide-react';
import type { Todo } from '../types/todo';

interface AddTodoFormProps {
  onAddTodo: (todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
}

export default function AddTodoForm({ onAddTodo }: AddTodoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddTodo({
        title: title.trim(),
        description: description.trim() || null,
        completed: false,
        priority,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          disabled={isSubmitting}
        />
        
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add description (optional)"
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Flag className="w-4 h-4 text-gray-500" />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
        </div>
        
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Add Task
        </button>
      </div>
    </form>
  );
}