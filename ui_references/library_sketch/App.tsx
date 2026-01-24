import React, { useState } from 'react';
import { 
  Search, 
  Settings, 
  ChevronDown, 
  Grid, 
  List, 
  Play, 
  MoreVertical,
  LayoutDashboard,
  Activity,
  BarChart3,
  Home,
  Menu,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { Video, ViewMode, SortMode } from './types';
import { Background } from './components/Layout/Background';
import { Sidebar } from './components/Layout/Sidebar';
import { DetailsPanel } from './components/DetailsPanel';
import { TreeMap } from './components/TreeMap/TreeMap';
import { Button, SearchInput, Badge, Card } from './components/UI/Components';

// --- Mock Data ---
const MOCK_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Pasta_Maker_01.mp4',
    thumbnail: 'https://picsum.photos/400/225?random=1',
    duration: '14:30',
    size: '450MB',
    path: '/Videos/Cooking/Tutorials',
    status: 'ready',
    tags: ['cooking', 'pasta', 'tutorial'],
    dateAdded: '2023-10-25',
    analysis: { vlm: true, audio: true, embed: true }
  },
  {
    id: '2',
    title: 'Knife_Skills_Basic.mp4',
    thumbnail: 'https://picsum.photos/400/225?random=2',
    duration: '08:15',
    size: '210MB',
    path: '/Videos/Cooking/Skills',
    status: 'processing',
    progress: 45,
    tags: ['cooking', 'basics', 'safety'],
    dateAdded: '2023-10-26',
    analysis: { vlm: true, audio: false, embed: false }
  },
  {
    id: '3',
    title: 'Ragu_Intro_Sequence.mov',
    thumbnail: 'https://picsum.photos/400/225?random=3',
    duration: '02:45',
    size: '850MB',
    path: '/Videos/Cooking/Ragu',
    status: 'ready',
    tags: ['cooking', 'sauce', 'intro'],
    dateAdded: '2023-10-24',
    analysis: { vlm: true, audio: true, embed: true }
  },
  {
    id: '4',
    title: 'Dough_Prep_Angle2.mp4',
    thumbnail: 'https://picsum.photos/400/225?random=4',
    duration: '12:20',
    size: '1.2GB',
    path: '/Videos/Cooking/Pasta',
    status: 'ready',
    tags: ['cooking', 'dough', 'b-roll'],
    dateAdded: '2023-10-22',
    analysis: { vlm: true, audio: true, embed: false }
  },
  {
    id: '5',
    title: 'Kitchen_Tour_Vlog.mp4',
    thumbnail: 'https://picsum.photos/400/225?random=5',
    duration: '22:10',
    size: '3.4GB',
    path: '/Videos/Vlogs',
    status: 'ready',
    tags: ['vlog', 'kitchen', 'tour'],
    dateAdded: '2023-10-20',
    analysis: { vlm: true, audio: true, embed: true }
  },
  {
    id: '6',
    title: 'Sourdough_Fail_Compilation.mp4',
    thumbnail: 'https://picsum.photos/400/225?random=6',
    duration: '05:00',
    size: '150MB',
    path: '/Videos/Baking',
    status: 'error',
    tags: ['baking', 'fail', 'funny'],
    dateAdded: '2023-10-18',
    analysis: { vlm: false, audio: false, embed: false }
  },
  {
    id: '7',
    title: 'Japan_Trip_Raw_001.mov',
    thumbnail: 'https://picsum.photos/400/225?random=7',
    duration: '45:20',
    size: '8.2GB',
    path: '/Videos/Travel/Japan',
    status: 'ready',
    tags: ['travel', 'raw', 'japan'],
    dateAdded: '2023-09-10',
    analysis: { vlm: true, audio: true, embed: true }
  },
  {
    id: '8',
    title: 'Japan_Trip_Raw_002.mov',
    thumbnail: 'https://picsum.photos/400/225?random=8',
    duration: '32:10',
    size: '5.1GB',
    path: '/Videos/Travel/Japan',
    status: 'ready',
    tags: ['travel', 'raw', 'japan'],
    dateAdded: '2023-09-10',
    analysis: { vlm: true, audio: true, embed: true }
  }
];

type Page = 'library' | 'analytics' | 'activity';

export default function App() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(MOCK_VIDEOS[0]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activePage, setActivePage] = useState<Page>('library');
  
  // Handlers
  const handleScan = () => {
    alert("Triggering library scan...");
  };

  return (
    <div className="flex flex-col h-screen text-foreground font-sans selection:bg-accent/30 selection:text-white overflow-hidden">
      <Background />

      {/* --- Top Header (Floating) --- */}
      <header className="h-16 relative flex items-center justify-between px-6 shrink-0 z-30">
        
        {/* Left: Brand & Navigation */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-[0_0_20px_-5px_rgba(139,92,246,0.6)] ring-1 ring-white/10">
              <span className="font-bold text-white text-lg tracking-tighter">KR</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white leading-none">KURO-ROKU</span>
              <span className="text-[10px] text-foreground-muted tracking-wide font-medium">VLM STUDIO</span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-white/10 mx-2 hidden md:block" />

          <nav className="flex items-center bg-white/[0.03] p-1 rounded-lg border border-white/[0.05]">
            <Button 
              variant="ghost" 
              size="sm" 
              className={activePage === 'library' ? 'text-white bg-white/[0.08] shadow-sm' : 'text-foreground-muted hover:text-foreground'}
              onClick={() => setActivePage('library')}
            >
              Library
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={activePage === 'analytics' ? 'text-white bg-white/[0.08] shadow-sm' : 'text-foreground-muted hover:text-foreground'}
              onClick={() => setActivePage('analytics')}
            >
              Analytics
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className={activePage === 'activity' ? 'text-white bg-white/[0.08] shadow-sm' : 'text-foreground-muted hover:text-foreground'}
              onClick={() => setActivePage('activity')}
            >
              Activity
            </Button>
          </nav>
        </div>

        {/* Center: Search Bar (Absolute Centering) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[420px] hidden lg:block">
          <SearchInput 
            placeholder="Search library... (Cmd+K)" 
            icon={<Search size={16} />}
            className="w-full shadow-2xl shadow-black/40 ring-1 ring-white/5 bg-background-elevated/80 backdrop-blur-xl" 
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
             <Button variant="secondary" size="sm" icon={<Filter size={14} />}>Filter</Button>
             <Button variant="primary" size="sm" onClick={handleScan} className="shadow-lg shadow-accent/20">
               <ArrowUpRight size={16} /> Scan
             </Button>
          </div>
          
          <div className="h-6 w-[1px] bg-white/10" />

          <Button variant="icon" size="sm">
            <Settings size={20} />
          </Button>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent to-violet-500 border border-white/20 shadow-lg cursor-pointer hover:scale-105 transition-transform" />
        </div>
      </header>

      {/* --- Main Workspace (Floating Layout) --- */}
      <div className="flex flex-1 overflow-hidden relative pb-4">
        
        {/* Floating Sidebar */}
        <Sidebar />

        {/* Central Stage (The Card) */}
        <main className="flex-1 flex flex-col bg-background-base border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden relative mx-2 my-2 lg:my-0 lg:mt-2">
          
          {/* Internal Toolbar */}
          <div className="h-14 flex items-center justify-between px-5 border-b border-white/[0.06] bg-white/[0.01] shrink-0">
            
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm">
              <div className="p-1.5 bg-white/5 rounded-md mr-3 text-foreground-muted">
                <Home size={14} />
              </div>
              <span className="text-foreground-muted hover:text-foreground transition-colors">Library</span>
              <span className="mx-2 text-white/20">/</span>
              <span className="text-foreground-muted hover:text-foreground transition-colors">Videos</span>
              <span className="mx-2 text-white/20">/</span>
              <div className="flex items-center gap-2 px-2 py-1 bg-accent/10 text-accent rounded-md border border-accent/20">
                <span className="font-medium">
                  {viewMode === 'treemap' ? 'Disk Usage' : 'Cooking'}
                </span>
                <ChevronDown size={12} />
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-foreground-subtle font-medium uppercase tracking-wider mr-2">View Mode</span>
              <div className="flex bg-black/20 p-1 rounded-lg border border-white/5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-foreground-muted hover:text-foreground hover:bg-white/5'}`}
                  title="Grid View"
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white/10 text-white shadow-sm' : 'text-foreground-muted hover:text-foreground hover:bg-white/5'}`}
                  title="List View"
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => setViewMode('treemap')}
                  className={`p-1.5 rounded-md transition-all ${viewMode === 'treemap' ? 'bg-white/10 text-white shadow-sm' : 'text-foreground-muted hover:text-foreground hover:bg-white/5'}`}
                  title="Tree View"
                >
                  <LayoutDashboard size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Content Surface */}
          <div className="flex-1 overflow-hidden relative bg-black/20">
            {viewMode === 'treemap' ? (
              <TreeMap 
                videos={MOCK_VIDEOS} 
                onSelect={setSelectedVideo}
                selectedId={selectedVideo?.id}
              />
            ) : (
              <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-6">
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6" : "flex flex-col gap-2"}>
                  {MOCK_VIDEOS.map((video) => (
                    <Card 
                      key={video.id} 
                      onClick={() => setSelectedVideo(video)}
                      className={`group relative flex ${viewMode === 'list' ? 'flex-row h-24 items-center' : 'flex-col'} ${selectedVideo?.id === video.id ? 'ring-2 ring-accent ring-offset-2 ring-offset-[#050506]' : 'hover:ring-1 hover:ring-white/20'}`}
                    >
                      {/* Thumbnail */}
                      <div className={`relative ${viewMode === 'list' ? 'w-40 h-24 shrink-0' : 'aspect-video'} bg-background-deep overflow-hidden`}>
                        <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                        
                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                           <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:scale-110 transition-transform">
                             <Play size={16} className="ml-0.5 text-white fill-white" />
                           </div>
                        </div>

                        {/* Duration Badge */}
                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10">
                          <span className="text-[10px] font-mono text-white/90">{video.duration}</span>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className={`flex-1 flex flex-col justify-between ${viewMode === 'list' ? 'px-4 py-2' : 'p-4'}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-medium text-foreground truncate w-full group-hover:text-accent transition-colors" title={video.title}>
                              {video.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="text-[10px] text-foreground-muted">{video.size}</span>
                               <span className="text-[10px] text-white/10">•</span>
                               <span className="text-[10px] text-foreground-muted">{video.dateAdded}</span>
                            </div>
                          </div>
                          <button className="text-foreground-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                        
                        <div className={`flex items-center justify-between ${viewMode === 'list' ? 'mt-0' : 'mt-4'}`}>
                          {video.status === 'processing' ? (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                              <span className="text-[10px] text-accent">Processing...</span>
                            </div>
                          ) : (
                            <div className="flex gap-1">
                              {video.analysis.vlm && <Badge status="neutral">VLM</Badge>}
                              {video.analysis.audio && <Badge status="neutral">WAV</Badge>}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Floating Details Panel */}
        <DetailsPanel video={selectedVideo} />

      </div>
    </div>
  );
}