import { LucideIcon } from 'lucide-react';

interface ProgramCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ProgramCard({ icon: Icon, title, description }: ProgramCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E2E8F0] hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-[#2B6C8F]/10 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[#2B6C8F]" />
      </div>
      <h3 className="text-lg mb-2 text-[#1A2A36]">{title}</h3>
      <p className="text-sm text-[#1A2A36]/70 leading-relaxed">{description}</p>
    </div>
  );
}
