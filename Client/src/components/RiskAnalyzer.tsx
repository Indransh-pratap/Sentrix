import { motion } from "framer-motion";

interface RiskAnalyzerProps {
  riskPercent: number;
  level: string;
}

export default function RiskAnalyzer({ riskPercent, level }: RiskAnalyzerProps) {

  const getRiskColor = () => {
    if (riskPercent >= 70) return "bg-red-500";
    if (riskPercent >= 40) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getRiskText = () => {
    if (riskPercent >= 70) return "text-red-400";
    if (riskPercent >= 40) return "text-yellow-400";
    return "text-green-400";
  };

  return (
    <div className="mt-14 bg-slate-900 border border-white/5 rounded-xl p-6">
      <div className="flex justify-between text-xs text-slate-400 mb-2 uppercase">
        <span>Safe</span>
        <span>Critical</span>
      </div>

      <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${riskPercent}%` }}
          transition={{ duration: 1 }}
          className={`h-full ${getRiskColor()}`}
        />
      </div>

      <div className={`text-right mt-3 font-bold ${getRiskText()}`}>
        {riskPercent}/100 - {level}
      </div>
    </div>
  );
}