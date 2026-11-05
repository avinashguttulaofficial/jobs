import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, TrendingUp, DollarSign, Award, Layers } from 'lucide-react';

export const ResourcesPage: React.FC = () => {
  const salaryBenchmarks = [
    { role: 'Senior UI/UX Designer', us: '$140k – $185k', eu: '€75k – €105k', freelance: '$90 – $150/hr' },
    { role: 'Creative Frontend Engineer', us: '$135k – $175k', eu: '€70k – €95k', freelance: '$85 – $140/hr' },
    { role: 'Design Systems Lead', us: '$160k – $210k', eu: '€90k – €125k', freelance: '$110 – $180/hr' },
    { role: 'Art Director (Digital)', us: '$150k – $200k', eu: '€80k – €115k', freelance: '$100 – $165/hr' },
    { role: 'Motion & 3D Interactive', us: '$130k – $170k', eu: '€65k – €90k', freelance: '$80 – $135/hr' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block">
          Editorial Insights
        </span>
        <h1 className="font-display font-black text-5xl sm:text-6xl text-[#121212] tracking-tight uppercase">
          Career Resources & Standards
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base">
          Empirical salary benchmarks, portfolio critique guidelines, and hiring insights for the global design and creative engineering ecosystem.
        </p>
      </div>

      {/* Salary Benchmarks Table */}
      <section className="bg-white border border-neutral-300 rounded-xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
          <div>
            <h2 className="font-display font-bold text-xl text-neutral-900">
              2026 Global Compensation Index
            </h2>
            <p className="text-xs text-neutral-500">
              Aggregated across 200+ verified listings in North America, Europe, and Remote studios.
            </p>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">Updated Q4 2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 font-mono text-neutral-400 uppercase text-[10px]">
                <th className="py-3 px-2">Discipline & Role</th>
                <th className="py-3 px-2">US / Canada Median</th>
                <th className="py-3 px-2">Europe / UK Median</th>
                <th className="py-3 px-2">Global Freelance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 font-mono">
              {salaryBenchmarks.map((item, idx) => (
                <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3.5 px-2 font-sans font-semibold text-neutral-900">
                    {item.role}
                  </td>
                  <td className="py-3.5 px-2 text-neutral-700">{item.us}</td>
                  <td className="py-3.5 px-2 text-neutral-700">{item.eu}</td>
                  <td className="py-3.5 px-2 text-emerald-700 font-medium">{item.freelance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-3">
          <Award className="w-5 h-5 text-neutral-900" />
          <h3 className="font-display font-bold text-lg text-neutral-900">
            Awwwards Portfolio Audit
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            How leading agency creative directors evaluate candidates: typographic discipline, mobile responsiveness, and proof of shipped impact.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-3">
          <Layers className="w-5 h-5 text-neutral-900" />
          <h3 className="font-display font-bold text-lg text-neutral-900">
            Figma Token Architecture
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Structuring multi-tier design systems, semantic color variables, and cross-platform token handoffs to React engineering squads.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-3">
          <TrendingUp className="w-5 h-5 text-neutral-900" />
          <h3 className="font-display font-bold text-lg text-neutral-900">
            Fractional Retainer Guide
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Transitioning from project-based freelance to monthly recurring advisory retainers for high-volume eCommerce consumer brands.
          </p>
        </div>
      </div>
    </div>
  );
};
