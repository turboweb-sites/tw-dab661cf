import { CheckSquare, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <img src="https://i.imgur.com/yourimage.png" alt="Logo" className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TodoMaster
            </h1>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Stay organized, stay productive
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}