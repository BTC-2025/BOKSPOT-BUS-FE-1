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
  categoryName?: string;
  merchantCategory?: string;
  inlineMode?: boolean;
  onChange?: (data: any) => void;
}

export default function DynamicForm({ 
  archetype, 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  isLoading,
  categoryName = '',
  merchantCategory = '',
  inlineMode = false,
  onChange
}: DynamicFormProps) {
  const baseSchema = ARCHETYPE_SCHEMAS[archetype];
  const [formData, setFormData] = useState<any>(initialData || {});

  if (!baseSchema) {
    return <div className="p-4 text-red-500 bg-red-50 rounded-xl">Invalid Archetype Configured</div>;
  }

  // Context-aware schema resolution to ensure Cricket Ground, Turfs, Meeting Rooms, etc.
  // get completely relevant labels & placeholders without conflicts
  const isCricket = 
    categoryName.toLowerCase().includes('cricket') || 
    merchantCategory.toLowerCase().includes('cricket');

  const isMeetingStudio = 
    categoryName.toLowerCase().includes('meeting') || 
    categoryName.toLowerCase().includes('coworking') || 
    categoryName.toLowerCase().includes('podcast') || 
    categoryName.toLowerCase().includes('studio') ||
    merchantCategory.toLowerCase().includes('meeting') ||
    merchantCategory.toLowerCase().includes('studio');

  const isFootballTurf =
    categoryName.toLowerCase().includes('football') ||
    merchantCategory.toLowerCase().includes('football');

  const isBadminton =
    categoryName.toLowerCase().includes('badminton') ||
    merchantCategory.toLowerCase().includes('badminton');

  const title = (archetype === 'RENTAL' || archetype === 'FACILITY_HOURLY')
    ? (isCricket 
        ? "Cricket Ground, Pitch & Net Details" 
        : isMeetingStudio 
        ? "Meeting Room & Studio Specification" 
        : isBadminton
        ? "Badminton Court Specification"
        : isFootballTurf
        ? "Football Turf & Ground Specification"
        : baseSchema.title)
    : baseSchema.title;

  const fields = baseSchema.fields.map((field: any) => {
    if (archetype === 'RENTAL' || archetype === 'FACILITY_HOURLY') {
      if (isCricket) {
        if (field.name === 'facilityName') {
          return {
            ...field,
            label: "Pitch / Ground / Net Name",
            placeholder: "e.g., Main Turf Pitch A, Box Cricket Pitch 1, Practice Net Turf 2"
          };
        }
        if (field.name === 'turfSize') {
          return {
            ...field,
            label: "Ground & Pitch Dimensions",
            placeholder: "e.g., 65m Boundary / 22-Yard Pitch / 100ft x 40ft Box Arena"
          };
        }
        if (field.name === 'surfaceType') {
          return {
            ...field,
            label: "Pitch Surface & Outfield Type",
            placeholder: "e.g., Natural Turf / Red Clay / Coir Matting / Artificial AstroTurf"
          };
        }
        if (field.name === 'hourlyRate') {
          return {
            ...field,
            label: "Base Hourly Ground Slot Rate (₹)",
            placeholder: "e.g., 1500"
          };
        }
        if (field.name === 'floodlightsSurcharge') {
          return {
            ...field,
            label: "Match Floodlights Surcharge (₹ / Hour)",
            placeholder: "e.g., 300"
          };
        }
        if (field.name === 'equipmentAddons') {
          return {
            ...field,
            label: "Cricket Equipment & Gear Available",
            placeholder: "e.g., Leather Match Balls, English Willow Bats, Stumps, Pads & Helmets"
          };
        }
        if (field.name === 'refereeOrManager') {
          return {
            ...field,
            label: "Match Umpire / Ground Curator on Duty",
            placeholder: "e.g., Certified Umpire / Ground Curator available on request"
          };
        }
      } else if (isMeetingStudio) {
        if (field.name === 'facilityName') {
          return {
            ...field,
            label: "Room / Studio Name",
            placeholder: "e.g., Boardroom 1, Podcast Studio A, 12-Pax Brainstorming Room"
          };
        }
        if (field.name === 'turfSize') {
          return {
            ...field,
            label: "Seating Capacity & Floor Area",
            placeholder: "e.g., 12 Seater Conference / 400 sq.ft Studio"
          };
        }
        if (field.name === 'surfaceType') {
          return {
            ...field,
            label: "Acoustics & Setup Type",
            placeholder: "e.g., Acoustic Soundproofing / Whiteboard & 4K Display"
          };
        }
        if (field.name === 'equipmentAddons') {
          return {
            ...field,
            label: "Studio & Presentation Equipment",
            placeholder: "e.g., Shure SM7B Microphones, 4K Projector, High-Speed Wi-Fi"
          };
        }
        if (field.name === 'refereeOrManager') {
          return {
            ...field,
            label: "Studio Engineer / Facility Manager",
            placeholder: "e.g., Audio Engineer on-site, Floor Assistant"
          };
        }
      } else if (isBadminton) {
        if (field.name === 'facilityName') {
          return {
            ...field,
            label: "Court Name / Number",
            placeholder: "e.g., Court 1 (Teak Wood), Court 2 (Synthetic Mat)"
          };
        }
        if (field.name === 'surfaceType') {
          return {
            ...field,
            label: "Court Flooring Type",
            placeholder: "e.g., Yonex Approved BWF Synthetic Mat / Teak Wood Shock Absorbing"
          };
        }
        if (field.name === 'equipmentAddons') {
          return {
            ...field,
            label: "Badminton Gear Add-ons",
            placeholder: "e.g., Yonex Rackets (₹50), Mavis 350 Shuttles (₹120), Non-marking Shoes"
          };
        }
      } else if (isFootballTurf) {
        if (field.name === 'facilityName') {
          return {
            ...field,
            label: "Football Turf / Pitch Name",
            placeholder: "e.g., 7s Main AstroTurf A, 5s Cage Pitch 2"
          };
        }
        if (field.name === 'surfaceType') {
          return {
            ...field,
            label: "Turf Grass Specification",
            placeholder: "e.g., FIFA Certified 50mm Monofilament AstroTurf with Rubber Infill"
          };
        }
        if (field.name === 'equipmentAddons') {
          return {
            ...field,
            label: "Football Equipment & Gear",
            placeholder: "e.g., Match Footballs, Team Bibs (2 colors), Goalkeeper Gloves"
          };
        }
      }
    }
    return field;
  });

  const schema = {
    title,
    fields
  };

  const handleChange = (name: string, value: any) => {
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClasses = "w-full bg-slate-50 dark:bg-[#162033] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#ff6325] focus:ring-1 focus:ring-[#ff6325] transition-colors";

  return (
    <div className={inlineMode ? "space-y-4" : "bg-bg-tertiary/50 border border-border-brand/50 rounded-2xl overflow-hidden text-text-primary"}>
      {!inlineMode && (
        <div className="px-6 py-4 border-b border-border-brand/40 bg-bg-tertiary/80">
          <h3 className="text-base font-bold text-text-primary">{schema.title}</h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Fill in the details for this {archetype.toLowerCase()} service.
          </p>
        </div>
      )}

      <div className={inlineMode ? "space-y-5" : "p-6 space-y-6"}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {schema.fields.map((field: any, idx: number) => {
            const isFullWidth = field.type === 'textarea' || field.type === 'image-array' || field.name === 'perks' || field.name === 'amenities';

            return (
              <div key={idx} className={`space-y-1.5 ${isFullWidth ? 'sm:col-span-2' : ''}`}>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>

                {/* Text Input */}
                {field.type === 'text' && (
                  <input
                    type="text"
                    required={field.required}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={inputClasses}
                    placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                  />
                )}

                {/* Number Input */}
                {field.type === 'number' && (
                  <input
                    type="number"
                    required={field.required}
                    value={formData[field.name] ?? ''}
                    onChange={(e) => handleChange(field.name, e.target.value === '' ? '' : Number(e.target.value))}
                    className={inputClasses}
                    placeholder={field.placeholder || `0`}
                  />
                )}

                {/* Textarea */}
                {field.type === 'textarea' && (
                  <textarea
                    required={field.required}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={`${inputClasses} min-h-[80px]`}
                    placeholder={field.placeholder || `Enter details...`}
                  />
                )}

                {/* Date Input */}
                {field.type === 'date' && (
                  <input
                    type="date"
                    id={`field-${field.name}`}
                    required={field.required}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={inputClasses}
                  />
                )}

                {/* Time Input */}
                {field.type === 'time' && (
                  <input
                    type="time"
                    id={`field-${field.name}`}
                    required={field.required}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={inputClasses}
                  />
                )}

                {/* Array / Multi-select */}
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
                      className={inputClasses}
                      placeholder={field.placeholder || `Comma separated values (e.g., item 1, item 2)`}
                    />
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
                      Separate items with commas
                    </p>
                  </div>
                )}

                {/* Image Array */}
                {field.type === 'image-array' && (
                  <div className="p-4 border-2 border-dashed border-slate-200 dark:border-white/20 rounded-xl bg-slate-50 dark:bg-[#162033] text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Paste image URLs (comma separated)
                    </p>
                    <input
                      type="text"
                      value={Array.isArray(formData[field.name]) ? formData[field.name].join(', ') : (formData[field.name] || '')}
                      onChange={(e) => {
                        const val = e.target.value.split(',').map((s: string) => s.trim());
                        handleChange(field.name, val);
                      }}
                      className={`${inputClasses} mt-2`}
                      placeholder={`https://image1.jpg, https://image2.jpg`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!inlineMode && (
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
              type="button"
              onClick={handleSubmit}
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
        )}
      </div>
    </div>
  );
}
