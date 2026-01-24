import React from 'react';
import { Video } from '../types';
import { 
  CheckCircle2, 
  Circle, 
  FileVideo, 
  HardDrive, 
  Clock, 
  FolderOpen,
  Maximize2,
  RefreshCw,
  MoreHorizontal,
  Share2,
  Download
} from 'lucide-react';
import { Button, Badge } from './UI/Components';

interface DetailsPanelProps {
  video: Video | null;
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({ video }) => {
  if (!video) {
    return (
      <aside className="w-80 h-full p-6 flex flex-col items-center justify-center text-foreground-muted opacity-50">
        <FileVideo className="w-12 h-12 mb-4 opacity-20" />
        <p className="text-sm">Select a video to view details</p>
      </aside>
    );
  }

  const AnalysisItem = ({ label, status }: { label: string, status: boolean | 'pending' }) => (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0 group">
      <span className="text-sm text-foreground-muted group-hover:text-foreground transition-colors">{label}</span>
      <div className="flex items-center gap-2">
        {status === true && (
          <CheckCircle2 size={14} className="text-emerald-500" />
        )}
        {status === 'pending' && (
          <RefreshCw size={14} className="text-amber-500 animate-spin" />
        )}
        {status === false && (
          <Circle size={14} className="text-white/10" />
        )}
      </div>
    </div>
  );

  return (
    <aside className="w-80 flex flex-col h-full pt-4 pb-6 pl-2 pr-4">
      {/* Detail Card */}
      <div className="flex-1 flex flex-col bg-background-base/50 backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden shadow-xl">
        
        {/* Header Actions */}
        <div className="p-4 flex items-center justify-between border-b border-white/[0.06]">
          <h2 className="text-xs font-mono text-foreground-subtle tracking-widest opacity-60">PROPERTIES</h2>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-white/5 rounded-lg text-foreground-muted hover:text-foreground transition-colors">
               <Share2 size={14} />
            </button>
            <button className="p-1.5 hover:bg-white/5 rounded-lg text-foreground-muted hover:text-foreground transition-colors">
               <Download size={14} />
            </button>
            <button className="p-1.5 hover:bg-white/5 rounded-lg text-foreground-muted hover:text-foreground transition-colors">
               <MoreHorizontal size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto custom-scrollbar flex-1">
          {/* Preview */}
          <div className="p-4 pb-0">
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-white/10 relative group shadow-lg">
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                 <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:scale-110 transition-transform">
                   <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                 </div>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-6">
            {/* Title & Status */}
            <div>
              <h3 className="text-lg font-semibold text-foreground leading-tight mb-3 break-words tracking-tight">{video.title}</h3>
              <div className="flex flex-wrap gap-2">
                <Badge status={video.status === 'ready' ? 'success' : video.status === 'processing' ? 'processing' : 'warning'}>
                  {video.status === 'processing' ? `Processing ${video.progress}%` : video.status}
                </Badge>
                <div className="px-1.5 py-0.5 rounded text-[10px] font-mono text-foreground-muted border border-white/10">AVC1</div>
                <div className="px-1.5 py-0.5 rounded text-[10px] font-mono text-foreground-muted border border-white/10">48KHZ</div>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="space-y-3 bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-foreground-muted">
                  <HardDrive size={14} />
                  <span>Size</span>
                </div>
                <span className="font-mono text-foreground">{video.size}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2 text-foreground-muted">
                  <Clock size={14} />
                  <span>Duration</span>
                </div>
                <span className="font-mono text-foreground">{video.duration}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2 text-foreground-muted">
                  <FolderOpen size={14} />
                  <span>Path</span>
                </div>
                <span className="font-mono text-foreground truncate max-w-[120px]" title={video.path}>...{video.path.split('/').pop()}</span>
              </div>
            </div>

            {/* Analysis Status Module */}
            <div>
              <h4 className="text-xs font-mono text-foreground-subtle uppercase mb-3 px-1">Analysis Status</h4>
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-1">
                <AnalysisItem label="VLM Indexing" status={video.analysis.vlm} />
                <AnalysisItem label="Audio Transcribe" status={video.analysis.audio} />
                <AnalysisItem label="Vector Embed" status={video.analysis.embed ? true : 'pending'} />
                <AnalysisItem label="Scene Detection" status={false} />
              </div>
            </div>

            {/* Tags */}
            <div>
               <h4 className="text-xs font-mono text-foreground-subtle uppercase mb-3 px-1">Tags</h4>
               <div className="flex flex-wrap gap-2">
                 {video.tags.map(tag => (
                   <span key={tag} className="text-xs text-accent bg-accent/10 px-2.5 py-1 rounded-md border border-accent/20 hover:bg-accent/20 hover:border-accent/30 cursor-pointer transition-all">
                     #{tag}
                   </span>
                 ))}
                 <button className="text-xs text-foreground-muted bg-transparent border border-dashed border-white/20 px-2 py-1 rounded-md hover:text-foreground hover:border-white/40 transition-colors">
                   + Add
                 </button>
               </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/[0.06] bg-white/[0.02]">
          <Button variant="secondary" className="w-full justify-between group">
            <span>Open Full Details</span>
            <Maximize2 size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
          </Button>
        </div>
      </div>
    </aside>
  );
};