import TodoItem from './TodoItem';
import type { Todo } from '../types/todo';

interface TodoListProps {
  todos: Todo[];
  onUpdateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  onDeleteTodo: (id: string) => Promise<void>;
}

export default function TodoList({ todos, onUpdateTodo, onDeleteTodo }: TodoListProps) {
  return (
    <div className="space-y-3">
      {todos.map(todo => (
        <TodoItem 
          key={todo.id}
          todo={todo}
          onUpdate={onUpdateTodo}
          onDelete={onDeleteTodo}
        />
      ))}
    </div>
  );
}