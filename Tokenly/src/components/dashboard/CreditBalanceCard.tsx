import React from 'react';
import { CreditCard, History } from 'lucide-react';
import Button from '../common/Button';

interface CreditBalanceCardProps {
  balance: number;
  onViewHistory: () => void;
}

const CreditBalanceCard: React.FC<CreditBalanceCardProps> = ({ balance, onViewHistory }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          <span className="text-sm font-medium opacity-90">Available Credits</span>
        </div>
        <Button
          variant="ghost"
          onClick={onViewHistory}
          className="text-white hover:bg-white/20"
        >
          <History className="w-4 h-4 mr-1" />
          History
        </Button>
      </div>
      <div className="mb-4">
        <span className="text-4xl font-bold">{balance}</span>
        <span className="text-lg ml-1 opacity-90">credits</span>
      </div>
      <div className="text-sm opacity-90">
        Earn by helping others. Each session = 10-50 credits
      </div>
    </div>
  );
};

export default CreditBalanceCard;
