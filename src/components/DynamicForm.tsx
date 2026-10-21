'use client';

import React, { useState } from 'react';
import { ARCHETYPE_SCHEMAS, Archetype } from '../lib/archetypes';
import { Save, AlertCircle, Clock, Calendar } from 'lucide-react';

interface DynamicFormProps {
  archetype: Archetype;
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function DynamicForm({ archetype, initialData = {}, onSubmit, onCancel, isLoading }: DynamicFormProps) {
  const schema = ARCHETYPE_SCHEMAS[archetype];
  const [formData, setFormData] = useState<any>(initialData || {});

  if (!schema) {
    return <div className="p-4 text-red-500 bg-red-50 rounded-xl">Invalid Archetype Configured</div>;
  }

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-bg-tertiary/50 border border-border-brand/50 rounded-2xl overflow-hidden text-text-primary">
      <div className="px-6 py-4 border-b border-border-brand/40 bg-bg-tertiary/80">
        <h3 className="text-base font-bold text-text-primary">{schema.title}</h3>
        <p className="text-xs text-text-secondary mt-0.5">
          Fill in the details for this {archetype.toLowerCase()} service.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {schema.fields.map((field: any, idx: number) => {
          return (
            <div key={idx} className="space-y-1.5">
              <label className="block text-sm font-bold text-text-secondary">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>

              {/* Text Input */}
              {field.type === 'text' && (
                <input
                  type="text"
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full bg-[#162033] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#ff6325] focus:ring-1 focus:ring-[#ff6325] transition-colors"
                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                />
              )}

              {/* Number Input */}
              {field.type === 'number' && (
                <input
                  type="number"
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, Number(e.target.value))}
                  className="w-full bg-[#162033] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#ff6325] focus:ring-1 focus:ring-[#ff6325] transition-colors"
                  placeholder={`0`}
                />
              )}

              {/* Textarea */}
              {field.type === 'textarea' && (
                <textarea
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full bg-[#162033] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#ff6325] focus:ring-1 focus:ring-[#ff6325] transition-colors min-h-[100px]"
                  placeholder={`Enter details...`}
                />
              )}

              {/* Date Input */}
              {field.type === 'date' && (
                <div className="relative">
                  <input
                    type="date"
                    id={`field-${field.name}`}
                    required={field.required}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full bg-[#162033] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6325] focus:ring-1 focus:ring-[#ff6325] transition-colors cursor-pointer"
                  />
                </div>
              )}

              {/* Time Input */}
              {field.type === 'time' && (
                <div className="relative">
                  <input
                    type="time"
                    id={`field-${field.name}`}
                    required={field.required}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full bg-[#162033] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff6325] focus:ring-1 focus:ring-[#ff6325] transition-colors cursor-pointer"
                  />
                </div>
              )}

              {/* Array / Multi-select (Simplified as comma separated for now) */}
              {(field.type === 'array' || field.type === 'multi-select') && (
                <div>
                  <input
                    type="text"
                    required={field.required}
                    value={Array.isArray(formData[field.name]) ? formData[field.name].join(', ') : (formData[field.name] || '')}
                    onChange={(e) => {
                      const val = e.target.value.split(',').map((s: string) => s.trim());
                      handleChange(field.name, val);
                    }}
                    className="w-full bg-[#162033] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#ff6325] focus:ring-1 focus:ring-[#ff6325] transition-colors"
                    placeholder={field.placeholder || `Comma separated values (e.g., item 1, item 2)`}
                  />
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
                    Separate items with commas
                  </p>
                </div>
              )}

              {/* Image Array */}
              {field.type === 'image-array' && (
                <div className="p-4 border-2 border-dashed border-white/20 rounded-xl bg-[#162033] text-center">
                  <span className="text-sm font-semibold text-[#ff6325] cursor-pointer">
                    Click to upload images
                  </span>
                  <p className="text-xs text-slate-400 mt-1">
                    (Paste URLs below or upload files)
                  </p>
                  <input
                    type="text"
                    value={Array.isArray(formData[field.name]) ? formData[field.name].join(', ') : (formData[field.name] || '')}
                    onChange={(e) => {
                      const val = e.target.value.split(',').map((s: string) => s.trim());
                      handleChange(field.name, val);
                    }}
                    className="w-full mt-3 bg-[#0f1624] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400"
                    placeholder={`Or paste image URLs (comma separated)`}
                  />
                </div>
              )}
            </div>
          );
        })}

        <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-gradient-to-r from-[#ff6325] to-[#e04e13] hover:brightness-110 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg shadow-[#ff6325]/25 transition-all disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <span className="animate-pulse">Saving...</span>
            ) : (
              <>
                <Save size={16} />
                Save & Proceed to Review
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
