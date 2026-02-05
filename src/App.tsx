import { useState, useEffect } from 'react';
import Header from './components/Header';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';
import { db } from './lib/supabase';
import type { Todo } from './types/todo';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await db.getAll('todos');
      setTodos(data);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todoData: Omit<Todo, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTodo = await db.create('todos', todoData);
      setTodos([newTodo, ...todos]);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const updatedTodo = await db.update('todos', id, updates);
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await db.delete('todos', id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active': return !todo.completed;
      case 'completed': return todo.completed;
      default: return true;
    }
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                <p className="text-sm text-gray-600">Active Tasks</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Tasks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Todo Form */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Task</h2>
          <AddTodoForm onAddTodo={addTodo} />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'active', 'completed'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filter === filterOption
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              <span className="ml-2 text-sm opacity-75">
                ({filterOption === 'all' ? stats.total : 
                  filterOption === 'active' ? stats.active : stats.completed})
              </span>
            </button>
          ))}
        </div>

        {/* Todo List */}
        <TodoList 
          todos={filteredTodos}
          onUpdateTodo={updateTodo}
          onDeleteTodo={deleteTodo}
        />

        {filteredTodos.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'completed' ? 'No completed tasks' :
               filter === 'active' ? 'No active tasks' : 'No tasks yet'}
            </h3>
            <p className="text-gray-600">
              {filter === 'all' && "Start by adding your first task above!"}
              {filter === 'active' && "All tasks are completed. Great job! 🎉"}
              {filter === 'completed' && "Complete some tasks to see them here."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}