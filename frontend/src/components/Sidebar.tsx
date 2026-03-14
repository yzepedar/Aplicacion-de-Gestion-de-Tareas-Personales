// Sidebar.tsx
export const Sidebar = () => (
    <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden lg:flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white font-bold shadow-lg shadow-blue-200">TB</div>
            <span className="text-xl font-bold text-slate-800">TaskBoard Pro</span>
        </div>
        <nav className="flex-1 space-y-2">
            <button className="w-full flex items-center gap-3 bg-blue-600 text-white p-3 rounded-xl font-bold shadow-lg shadow-blue-200">📊 Dashboard</button>
        </nav>
    </aside>
);