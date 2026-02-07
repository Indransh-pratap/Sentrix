import { Bot, Sparkles } from 'lucide-react';

interface AiExplanationPanelProps {
  explanation: {
    riskLevel?: 'High' | 'Medium' | 'Low' | 'Safe';
    web2?: string;
    web3?: string;
    recommendation?: string;
  } | string;
}

export function AiExplanationPanel({ explanation }: AiExplanationPanelProps) {

  // 🧠 Normalize backend response
  const data =
    typeof explanation === 'string'
      ? {
          riskLevel: 'High',
          web2: explanation,
          web3: explanation,
          recommendation:
            'Review frontend security policies and sanitize all user inputs.',
        }
      : explanation;

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            AI Risk Analysis
            <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Powered by Trae AI
            </span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Plain-English Security Explanation
          </p>
        </div>
      </div>

      {/* Impacts */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-background/50 rounded-lg p-4 border border-white/5">
          <h4 className="text-sm font-semibold text-white mb-2">
            Web2 Impact (Users)
          </h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            {data.web2 || 'No Web2 impact detected.'}
          </p>
        </div>

        <div className="bg-background/50 rounded-lg p-4 border border-white/5">
          <h4 className="text-sm font-semibold text-white mb-2">
            Web3 Impact (Wallets)
          </h4>
          <p className="text-sm text-gray-400 leading-relaxed">
            {data.web3 || 'No Web3 wallet risk detected.'}
          </p>
        </div>
      </div>

      {/* Recommendation */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
        <div className="w-1 h-full bg-green-500 rounded-full shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-green-400 mb-1">
            Recommendation
          </h4>
          <p className="text-sm text-gray-300">
            {data.recommendation ||
              'Apply secure frontend practices and enforce strict security headers.'}
          </p>
        </div>
      </div>
    </div>
  );
}
