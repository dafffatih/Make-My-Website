"use client";

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import packagesData from "@/lib/project-packages.json";
import { createProject } from "@/app/actions/project";

export default function Stage1Setup({ onProjectCreated }: { onProjectCreated: (prj: any) => void }) {
  const [selectedPkgIdx, setSelectedPkgIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const selectedPkg = selectedPkgIdx !== null ? packagesData.forms[selectedPkgIdx] : null;

  // Generate dynamic Zod schema
  const schema = useMemo(() => {
    if (!selectedPkg) return z.object({});
    
    const shape: any = {};
    selectedPkg.sections.forEach(section => {
      section.fields.forEach(field => {
        const key = field.label.replace(/[^a-zA-Z0-9]/g, '_');
        if (field.type === 'short_text' || field.type === 'long_text' || field.type === 'select' || field.type === 'date') {
          shape[key] = z.string().min(1, "This field is required");
        } else if (field.type === 'multiselect') {
          shape[key] = z.array(z.string()).optional();
        } else if (field.type === 'file') {
          shape[key] = z.any().optional();
        }
      });
    });

    // Special Addons calculation, we just track the selected array of strings
    return z.object(shape);
  }, [selectedPkg]);

  const { register, handleSubmit, control, formState: { errors }, watch, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {}
  });

  const onSubmit = async (data: any) => {
    if (!selectedPkg) return;
    setLoading(true);
    setErrorMsg("");

    try {
      // Calculate Addons price dynamically
      let addonsPrice = 0;
      selectedPkg.sections.forEach(section => {
        section.fields.forEach(field => {
          if (field.type === 'multiselect' && field.options && typeof field.options[0] === 'object') {
            const key = field.label.replace(/[^a-zA-Z0-9]/g, '_');
            const selectedNames = data[key] || [];
            
            selectedNames.forEach((n: string) => {
              const opt = (field.options as any[]).find(o => o.name === n);
              if (opt && opt.price) addonsPrice += opt.price;
            });
          }
        });
      });

      // Special urgency check if present
      selectedPkg.sections.forEach(sec => {
        sec.fields.forEach(f => {
          if (f.type === 'select' && f.label === 'Urgency') {
            const key = f.label.replace(/[^a-zA-Z0-9]/g, '_');
            const val = data[key];
            const opt = (f.options as any[])?.find(o => o.name === val);
            if (opt && opt.price) addonsPrice += opt.price;
          }
        });
      });

      const maxRevisions = selectedPkg.package === "Landing Page" ? 2 : selectedPkg.package === "Basic" ? 3 : 5;

      const projectData = {
        name: data.Business_Brand_Name || data.Business_Name || `${selectedPkg.package} Project`,
        package: selectedPkg.package,
        basePrice: selectedPkg.base_price,
        addonsPrice,
        maxRevisions,
        formDetails: data
      };

      const prj = await createProject(projectData);
      onProjectCreated(prj);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  const currentValues = watch();

  // Dynamic price preview
  let currAddonsPrice = 0;
  if (selectedPkg) {
    selectedPkg.sections.forEach(sec => {
      sec.fields.forEach(f => {
        if (f.type === 'multiselect' && f.options && typeof f.options[0] === 'object') {
          const key = f.label.replace(/[^a-zA-Z0-9]/g, '_');
          const selectedNames = currentValues[key] || [];
          selectedNames.forEach((n: string) => {
            const opt = (f.options as any[]).find(o => o.name === n);
            if (opt && opt.price) currAddonsPrice += opt.price;
          });
        }
        if (f.type === 'select' && f.label === 'Urgency') {
          const key = f.label.replace(/[^a-zA-Z0-9]/g, '_');
          const val = currentValues[key];
          const opt = (f.options as any[])?.find(o => o.name === val);
          if (opt && opt.price) currAddonsPrice += opt.price;
        }
      });
    });
  }

  if (selectedPkgIdx === null) {
    return (
      <div className="p-8 space-y-6">
        <h3 className="text-xl font-bold text-white mb-4">Select a Package</h3>
        <div className="grid gap-4">
          {packagesData.forms.map((pkg, idx) => (
            <button
              key={idx}
              onClick={() => { setSelectedPkgIdx(idx); reset(); }}
              className="text-left w-full p-6 bg-surface-container-high rounded-2xl border border-outline-variant/10 hover:border-primary/50 hover:bg-surface-container-highest transition-all group"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{pkg.package}</h4>
                <span className="text-on-surface-variant font-black tracking-widest uppercase text-xs">
                  {pkg.base_price > 0 ? `$${pkg.base_price}` : "Custom"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-black text-white">{selectedPkg.package} Setup</h3>
          <p className="text-on-surface-variant text-sm mt-1">Please fill in the project requirements.</p>
        </div>
        <button 
          onClick={() => setSelectedPkgIdx(null)}
          className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-outline-variant/20 hover:bg-surface-container text-on-surface-variant hover:text-white transition-colors"
        >
          Change Package
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 max-w-2xl">
        {selectedPkg.sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-6">
            <h4 className="text-primary font-bold tracking-widest uppercase text-xs border-b border-outline-variant/10 pb-2">
              {section.title}
            </h4>
            
            {section.fields.map((field, fIdx) => {
              const key = field.label.replace(/[^a-zA-Z0-9]/g, '_');
              const hasError = errors[key];

              return (
                <div key={fIdx} className="group flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant group-focus-within:text-primary transition-colors">
                    {field.label} {field.type !== 'file' && '*'}
                  </label>
                  
                  {field.type === 'short_text' && (
                    <input
                      type="text"
                      className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-3 focus:ring-0 focus:border-primary text-white transition-all placeholder:text-zinc-700"
                      {...register(key)}
                    />
                  )}

                  {field.type === 'long_text' && (
                    <textarea
                      rows={3}
                      className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-3 focus:ring-0 focus:border-primary text-white transition-all placeholder:text-zinc-700 resize-none"
                      {...register(key)}
                    />
                  )}

                  {field.type === 'date' && (
                    <input
                      type="date"
                      className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-3 focus:ring-0 focus:border-primary text-white transition-all"
                      {...register(key)}
                    />
                  )}

                  {field.type === 'file' && (
                    <input
                      type="file"
                      className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-surface-container-high file:text-white hover:file:bg-surface-container-highest transition-all mt-2"
                      {...register(key)}
                    />
                  )}

                  {field.type === 'select' && field.options && (
                    <select
                      className="w-full bg-surface-container border-0 border-b border-outline-variant/30 py-3 px-2 focus:ring-0 focus:border-primary text-white transition-all outline-none"
                      {...register(key)}
                    >
                      <option value="">Select an option...</option>
                      {field.options.map((opt: any, oIdx: number) => {
                        const val = typeof opt === 'object' ? opt.name : opt;
                        const label = typeof opt === 'object' ? `${opt.name} (+$${opt.price})` : opt;
                        return <option key={oIdx} value={val}>{label}</option>
                      })}
                    </select>
                  )}

                  {field.type === 'multiselect' && field.options && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Controller
                        name={key}
                        control={control}
                        defaultValue={[]}
                        render={({ field: { value, onChange } }) => (
                          <>
                            {field.options?.map((opt: any, oIdx: number) => {
                              const val = typeof opt === 'object' ? opt.name : opt;
                              const label = typeof opt === 'object' ? `${opt.name} (+$${opt.price})` : opt;
                              const isSelected = value?.includes(val);

                              return (
                                <button
                                  type="button"
                                  key={oIdx}
                                  onClick={() => {
                                    const next = isSelected 
                                      ? value.filter((v: string) => v !== val)
                                      : [...value, val];
                                    onChange(next);
                                  }}
                                  className={`px-4 py-2 border rounded-full text-xs font-bold transition-all disabled:opacity-50 ${
                                    isSelected 
                                      ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(79,70,229,0.2)]' 
                                      : 'border-outline-variant/20 text-on-surface-variant hover:border-outline-variant/50'
                                  }`}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </>
                        )}
                      />
                    </div>
                  )}

                  {hasError && <span className="text-red-500 text-xs mt-1">{(hasError as any).message}</span>}
                </div>
              );
            })}
          </div>
        ))}

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-bold">
            {errorMsg}
          </div>
        )}

        <div className="pt-8 border-t border-outline-variant/10">
          <div className="flex justify-between items-center mb-6">
            <span className="text-on-surface-variant">Estimated Total</span>
            <span className="text-2xl font-black text-white">
              ${selectedPkg.base_price + currAddonsPrice} <span className="text-sm font-normal text-on-surface-variant">USD</span>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-full bg-white text-black font-black tracking-widest uppercase text-xs hover:bg-primary hover:text-on-primary hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex justify-center items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Submit Setup <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
