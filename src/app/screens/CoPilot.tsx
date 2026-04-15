import { Sparkles, Send, CheckCircle2, UserCheck, Mail, BookmarkPlus, Search } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

const quickActions = [
  { label: 'Qualify new leads', icon: UserCheck, prompt: 'Qualify all new inbound leads from the last 7 days.' },
  { label: 'Find stalled deals', icon: Search, prompt: 'Find all deals with no activity in the last 10 days.' },
  { label: 'Draft follow-up emails', icon: Mail, prompt: 'Draft follow-up emails for my top 5 stalled opportunities.' },
  { label: 'Run pipeline cleanup', icon: CheckCircle2, prompt: 'Run pipeline cleanup: flag deals with no next step in 14+ days.' },
];

type ChatTurn = {
  id: number;
  type: 'user' | 'ai';
  message: string;
  timestamp: string;
  results?: string[];
  action?: string;
};

const initialHistory: ChatTurn[] = [
  {
    id: 1,
    type: 'user',
    message: "Find all deals that haven't had activity in the last 10 days",
    timestamp: '2:34 PM',
  },
  {
    id: 2,
    type: 'ai',
    message: 'I found 12 deals with no activity in the last 10 days:',
    results: [
      'TechFlow Inc - $125K - Stalled for 14 days',
      'DataSync Corp - $95K - Stalled for 11 days',
      'CloudBase Solutions - $78K - Stalled for 10 days',
      'Enterprise Dynamics - $220K - Stalled for 13 days',
    ],
    action: 'Create re-engagement sequence for all 12 deals',
    timestamp: '2:34 PM',
  },
];

const promptLibrary = [
  { id: 1, title: 'Qualify Leads', prompt: 'Score all new inbound leads from the last 7 days based on company size, industry, and engagement level' },
  { id: 2, title: 'Deal Health Check', prompt: 'Analyze all deals in negotiation stage and flag any risks' },
  { id: 3, title: 'Email Sequences', prompt: 'Generate a 3-email nurture sequence for enterprise prospects' },
  { id: 4, title: 'Pipeline Cleanup', prompt: 'Find and archive deals that have been stalled for more than 30 days' },
  { id: 5, title: 'Revenue Forecast', prompt: 'Project Q2 revenue based on current pipeline and historical close rates' },
];

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function CoPilot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatTurn[]>(initialHistory);
  const [pending, setPending] = useState(false);
  const nextId = useRef(3);
  const sendCooldown = useRef(0);

  const pushAiReply = useCallback((userText: string) => {
    setPending(true);
    setTimeout(() => {
      const id = nextId.current++;
      setMessages((prev) => [
        ...prev,
        {
          id,
          type: 'ai',
          message: `Here’s a quick take on: “${userText.slice(0, 80)}${userText.length > 80 ? '…' : ''}”`,
          results: [
            'Matched 6 records in your pipeline (demo data).',
            '2 deals flagged as high priority.',
            'Suggested next step: schedule owner follow-up within 48h.',
          ],
          action: 'Apply recommended tasks to CRM',
          timestamp: nowTime(),
        },
      ]);
      setPending(false);
      toast.success('Co-Pilot responded');
    }, 600);
  }, []);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || pending) return;
      const now = Date.now();
      if (now - sendCooldown.current < 400) return;
      sendCooldown.current = now;
      const id = nextId.current++;
      setMessages((prev) => [
        ...prev,
        { id, type: 'user', message: trimmed, timestamp: nowTime() },
      ]);
      setInput('');
      pushAiReply(trimmed);
    },
    [pending, pushAiReply]
  );

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="belon-scroll flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="belon-enter-up py-6 text-center sm:py-8" style={{ animationDelay: '0ms' }}>
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#7c3aed] sm:h-16 sm:w-16">
                <Sparkles className="h-8 w-8" strokeWidth={2} />
              </div>
              <h2 className="mb-3 text-[clamp(1.25rem,4vw,1.5rem)] font-medium">AI Co-Pilot</h2>
              <p className="mx-auto max-w-lg px-1 text-sm leading-relaxed text-white/60 sm:text-base">
                Ask me anything about your pipeline, or tell me what to do. I can analyze deals, generate content, and automate workflows.
              </p>
            </div>

            <div className="mx-auto mb-8 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    type="button"
                    key={action.label}
                    style={{ animationDelay: `${120 + index * 45}ms` }}
                    className="belon-enter-up group min-h-[3.25rem] rounded-xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.07] disabled:opacity-50 touch-manipulation active:bg-white/10"
                    disabled={pending}
                    onClick={() => sendMessage(action.prompt)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/10 text-[#3b82f6] transition-colors group-hover:bg-[#3b82f6]/20">
                        <Icon className="h-5 w-5" strokeWidth={2} />
                      </div>
                      <span className="text-left text-sm leading-snug">{action.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {messages.map((item) => (
              <div key={item.id} className="belon-enter-up" style={{ animationDelay: '0ms' }}>
                {item.type === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-[min(100%,36rem)] rounded-2xl border border-[#3b82f6]/20 bg-[#3b82f6]/10 px-4 py-3 sm:px-5">
                      <p className="text-sm">{item.message}</p>
                      <div className="text-xs text-white/40 mt-2">{item.timestamp}</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 sm:gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#7c3aed]">
                      <Sparkles className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1 max-w-[min(100%,48rem)] rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5">
                      <p className="text-sm mb-4">{item.message}</p>

                      {item.results && (
                        <ul className="space-y-2 mb-4">
                          {item.results.map((result, i) => (
                            <li key={i} className="text-sm text-white/80 flex items-start gap-2">
                              <CheckCircle2 size={16} className="text-[#3b82f6] mt-0.5 flex-shrink-0" />
                              <span>{result}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {item.action && (
                        <button
                          type="button"
                          onClick={() =>
                            toast.success('Action queued', { description: item.action })
                          }
                          className="min-h-11 touch-manipulation rounded-xl bg-[#3b82f6] px-4 py-2.5 text-sm transition-colors hover:bg-[#3b82f6]/90 active:bg-[#3b82f6]/80"
                        >
                          {item.action}
                        </button>
                      )}

                      <div className="text-xs text-white/40 mt-4">{item.timestamp}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {pending && (
              <div className="flex gap-4 pl-14">
                <div className="text-sm text-white/50 animate-pulse">Co-Pilot is thinking…</div>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-white/5 bg-[#0d0e1a]/50 p-4 backdrop-blur-xl sm:p-6">
          <div className="mx-auto max-w-4xl">
            <form
              className="relative"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything or tell me what to do..."
                disabled={pending}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 pr-14 text-sm placeholder:text-white/40 transition-colors focus:border-white/20 focus:bg-white/[0.07] focus:outline-none disabled:opacity-50 sm:px-6 sm:py-4"
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-xl bg-[#3b82f6] transition-colors hover:bg-[#3b82f6]/90 active:bg-[#3b82f6]/80 disabled:pointer-events-none disabled:opacity-40"
              >
                <Send className="h-[18px] w-[18px]" strokeWidth={2} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <aside className="belon-scroll w-full shrink-0 border-t border-white/5 bg-[#0d0e1a]/30 p-4 sm:p-6 lg:max-w-[min(100%,20rem)] lg:w-80 lg:border-l lg:border-t-0 lg:overflow-y-auto">
        <h3 className="mb-4 text-sm text-white/60">Prompt Library</h3>
        <div className="space-y-3">
          {promptLibrary.map((item, index) => (
            <button
              type="button"
              key={item.id}
              style={{ animationDelay: `${index * 40}ms` }}
              className="belon-enter-x group w-full min-h-[3.25rem] cursor-pointer rounded-xl border border-white/10 bg-white/5 p-4 text-left backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.07] disabled:opacity-50 touch-manipulation active:bg-white/10"
              disabled={pending}
              onClick={() => {
                setInput(item.prompt);
                toast.message('Prompt loaded', { description: 'Press send or edit first.' });
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium">{item.title}</h4>
                <BookmarkPlus size={16} className="text-white/40 group-hover:text-white/60 transition-colors" />
              </div>
              <p className="text-xs text-white/60 leading-relaxed">{item.prompt}</p>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
