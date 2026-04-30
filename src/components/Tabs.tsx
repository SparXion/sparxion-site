import { ReactNode } from 'react';

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTabId: string;
  onTabChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTabId, onTabChange }: TabsProps) {
  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="border-b border-gray mb-xlarge">
        <div className="flex gap-medium overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                text-body py-medium px-medium border-b-2 transition-standard whitespace-nowrap
                ${
                  activeTabId === tab.id
                    ? 'border-black font-medium text-black'
                    : 'border-transparent text-medium-gray hover:text-black hover:border-gray'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab.content}
      </div>
    </div>
  );
}
