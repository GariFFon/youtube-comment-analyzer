import { 
  BarChart3, 
  MessageSquare, 
  Users, 
  FileText, 
  Copyright, 
  DollarSign, 
  Palette, 
  Volume2, 
  Settings,
  ChevronRight
} from "lucide-react";
import { useState } from "react";

interface YouTubeStudioSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function YouTubeStudioSidebar({ isOpen }: YouTubeStudioSidebarProps) {
  const [activeItem, setActiveItem] = useState("Dashboard");

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", active: true },
    { icon: MessageSquare, label: "Content" },
    { icon: BarChart3, label: "Analytics" },
    { icon: Users, label: "Community" },
    { icon: FileText, label: "Subtitles" },
    { icon: Copyright, label: "Copyright" },
    { icon: DollarSign, label: "Earn" },
    { icon: Palette, label: "Customization" },
    { icon: Volume2, label: "Audio library" },
  ];

  return (
    <>
      {/* Sidebar */}
      <div className={`fixed left-0 top-14 h-[calc(100vh-56px)] bg-[#0f0f0f] border-r border-gray-800 transition-all duration-300 z-40 ${
        isOpen ? 'w-64' : 'w-16'
      }`}>
        <div className="p-4">
          {/* Channel Info */}
          {isOpen && (
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">P</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm">Your channel</h3>
                  <p className="text-gray-400 text-xs">Punya Jain</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.label === activeItem;
              
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveItem(item.label)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-[#263238] text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Settings at bottom */}
          <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
              <Settings className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="text-sm font-medium">Settings</span>}
            </button>
            
            {isOpen && (
              <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mt-2">
                <span className="text-sm font-medium">Send feedback</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
