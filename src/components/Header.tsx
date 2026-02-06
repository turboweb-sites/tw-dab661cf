import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/90">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-1">
            <img 
              src="https://pub-166557a34b174b9a90d5376150b1d05a.r2.dev/assets/dab661cf-6915-44c6-a649-03b6f8d30958/d784ba0e-a1e5-4020-884e-735f3a9a480b/ChatGPT_Image_25_________2026______17_32_05_removebg_preview_1770356843550_5doe9e.webp" 
              alt="TodoMaster Logo" 
              className="w-full h-full object-contain"
            />
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