import React, { useState } from 'react';
import { X, Compass, ArrowRight } from 'lucide-react';
import { AgeGroup, PlaySkill, ToyProduct } from '../data/toys';
import { ResilientImage } from './ResilientImage';

interface GiftFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ToyProduct[];
  onSelectProduct: (product: ToyProduct) => void;
}

export const GiftFinderModal: React.FC<GiftFinderModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [selectedAge, setSelectedAge] = useState<Exclude<AgeGroup, 'all'>>('3-5');
  const [selectedSkill, setSelectedSkill] = useState<PlaySkill>('Spatial Reasoning');
  const [maxBudget, setMaxBudget] = useState<number>(150);

  if (!isOpen) return null;

  const matchedToys = products
    .filter((p) => {
      const ageMatches = p.ageGroup === selectedAge;
      const skillMatches = p.playSkills.includes(selectedSkill);
      const budgetMatches = p.price <= maxBudget;
      return (ageMatches || skillMatches) && budgetMatches;
    })
    .sort((a, b) => {
      const aScore = (a.ageGroup === selectedAge ? 2 : 0) + (a.playSkills.includes(selectedSkill) ? 2 : 0);
      const bScore = (b.ageGroup === selectedAge ? 2 : 0) + (b.playSkills.includes(selectedSkill) ? 2 : 0);
      return bScore - aScore;
    })
    .slice(0, 2);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gift-concierge-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#F9FAF8] border border-slate-200 rounded-2xl shadow-xl p-6 sm:p-8 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <p className="text-xs text-slate-500">Atelier Play Concierge</p>
            <h2 id="gift-concierge-title" className="text-2xl font-semibold text-slate-900 mt-0.5">
              Curate an Heirloom Gift by Developmental Stage
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Gift Concierge"
            className="w-9 h-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:text-slate-950"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6 space-y-5">
          {/* Step 1: Age Bracket */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              01. Child’s Age Stage
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['0-2', '3-5', '6-8', '9+'] as const).map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setSelectedAge(age)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap ${
                    selectedAge === age
                      ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  Ages {age} yrs
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Developmental Focus */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              02. Primary Play & Learning Interest
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  'Spatial Reasoning',
                  'Mechanical Cause & Effect',
                  'Imaginative Storytelling',
                  'Fine Motor',
                ] as const
              ).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => setSelectedSkill(skill)}
                  className={`py-2.5 px-3 rounded-lg text-xs font-semibold border text-left transition-colors truncate ${
                    selectedSkill === skill
                      ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Budget Ceiling */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span>03. Maximum Gift Budget</span>
              <span className="font-mono-tabular text-slate-900">Up to ${maxBudget}</span>
            </div>
            <input
              type="range"
              min={65}
              max={150}
              step={5}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-[#1D4ED8] cursor-pointer"
            />
          </div>

          {/* Recommendations */}
          <div className="pt-4 border-t border-slate-200/80">
            <p className="text-xs font-semibold text-slate-600 mb-3">
              Recommended Atelier Pairings ({matchedToys.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matchedToys.map((toy) => (
                <div
                  key={toy.id}
                  className="p-3.5 rounded-xl bg-white border border-slate-200/90 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-4/3 rounded-lg overflow-hidden bg-[#F1F3EF] mb-3">
                      <ResilientImage
                        src={toy.image}
                        alt={toy.name}
                        fallbackType={toy.fallbackType}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {toy.ageLabel} · {toy.category}
                    </p>
                    <h4 className="text-sm font-semibold text-slate-900 mt-0.5">{toy.name}</h4>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-semibold font-mono-tabular text-slate-900">
                      ${toy.price.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectProduct(toy);
                      }}
                      className="text-xs font-semibold text-[#1D4ED8] hover:underline flex items-center gap-1"
                    >
                      <span>Inspect Piece</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
