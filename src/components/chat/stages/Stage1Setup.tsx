"use client";

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import packagesData from "@/lib/project-packages.json";
import { createProject } from "@/app/actions/project";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const PACKAGE_DETAILS: Record<string, any> = {
  "Landing Page": {
    subtitle: "Quick Start",
    priceText: "$500 – $1,500",
    description: "Perfect for individuals or businesses who only need a single high-converting page.",
    features: [
      "1 page (landing page)", "Responsive design", "Clean UI/UX", "Basic SEO", "Contact form / CTA setup", "Fast loading"
    ],
    advantages: [
      "Affordable entry point", "Fast delivery (3–7 days)", "Ideal for testing ideas / ads"
    ]
  },
  "Basic": {
    subtitle: "Starter Website",
    priceText: "$2,500 – $5,000",
    description: "Perfect for individuals or small businesses who need a simple online presence.",
    features: [
      "Up to 3 pages (Home, About, Contact)", "Responsive design (mobile-friendly)", "Basic UI/UX design", "Contact form integration", "Basic SEO setup", "Fast loading speed"
    ],
    advantages: [
      "Affordable for US small businesses", "Quick turnaround (1–3 weeks)", "Ideal for portfolios or simple profiles"
    ]
  },
  "Standard": {
    subtitle: "Business Website",
    priceText: "$6,000 – $12,000",
    description: "Designed for growing businesses that need a more professional and functional website.",
    isPopular: true,
    features: [
      "Up to 7 pages", "Custom UI/UX design", "Responsive design (mobile & tablet)", "CMS integration (WordPress / similar)", "SEO optimization", "Social media & Google Maps", "Basic performance optimization"
    ],
    advantages: [
      "Professional business-level quality", "Easy content management", "Stronger SEO & online presence"
    ]
  },
  "Premium": {
    subtitle: "Advanced Website",
    priceText: "$15,000 – $30,000+",
    description: "Best for businesses that need advanced features and high performance.",
    features: [
      "Unlimited pages & Fully custom design", "Advanced UI/UX", "CMS or custom admin dashboard", "E-commerce functionality (optional)", "Payment gateway integration", "Advanced SEO & High performance", "API integration"
    ],
    advantages: [
      "Highly scalable", "Enterprise-level features", "Built for serious growth & revenue"
    ]
  },
  "Custom": {
    subtitle: "Tailored Solution",
    priceText: "Custom Scope",
    description: "For clients who want full control over the features and scope of their website.",
    features: [
      "Fully customizable (you choose everything)", "Flexible design & functionality", "Optional integrations", "Scalable architecture", "Consultation-based development"
    ],
    advantages: [
      "100% tailored to client needs", "Flexible scope & budget", "Ideal for startups or SaaS"
    ]
  }
};

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

  const { register, handleSubmit, control, formState: { errors }, watch, reset } = useForm<any>({
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
          if (field.type === 'multiselect' && (field as any).options && typeof (field as any).options[0] === 'object') {
            const key = field.label.replace(/[^a-zA-Z0-9]/g, '_');
            const selectedNames = data[key] || [];
            
            selectedNames.forEach((n: string) => {
              const opt = ((field as any).options as any[]).find(o => o.name === n);
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
            const opt = ((f as any).options as any[])?.find(o => o.name === val);
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
        if (f.type === 'multiselect' && (f as any).options && typeof (f as any).options[0] === 'object') {
          const key = f.label.replace(/[^a-zA-Z0-9]/g, '_');
          const selectedNames = (currentValues as any)[key] || [];
          (selectedNames as string[]).forEach((n: string) => {
            const opt = ((f as any).options as any[]).find(o => o.name === n);
            if (opt && opt.price) currAddonsPrice += opt.price;
          });
        }
        if (f.type === 'select' && f.label === 'Urgency') {
          const key = f.label.replace(/[^a-zA-Z0-9]/g, '_');
          const val = currentValues[key];
          const opt = ((f as any).options as any[])?.find(o => o.name === val);
          if (opt && opt.price) currAddonsPrice += opt.price;
        }
      });
    });
  }

  if (selectedPkgIdx === null) {
    return (
      <div className="p-8 space-y-6">
        <h3 className="text-xl font-bold text-white mb-4">Select a Package</h3>
        <Carousel opts={{ align: "start" }} className="w-full relative">
          <CarouselContent className="-ml-4">
            {packagesData.forms.map((pkg, idx) => {
              const details = PACKAGE_DETAILS[pkg.package] || PACKAGE_DETAILS["Custom"];
              
              return (
                <CarouselItem key={idx} className="pl-4 basis-[90%] md:basis-[70%] lg:basis-1/2">
                  <div className={`p-8 rounded-2xl flex flex-col hover:bg-surface-container-high transition-colors border h-full ${details.isPopular ? 'bg-surface-container-highest shadow-2xl border-primary/20 z-10 relative overflow-hidden' : 'bg-surface-container border-outline-variant/10'}`}>
                    {details.isPopular && <div className="absolute top-0 right-0 bg-primary text-on-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl">Popular</div>}
                    
                    <div className="mb-6">
                      <div className={`${details.isPopular ? 'text-primary' : 'text-on-surface-variant'} font-bold tracking-widest uppercase text-[10px] mb-2`}>{details.subtitle}</div>
                      <div className="text-2xl font-headline font-extrabold text-white mb-2">{pkg.package}</div>
                      <div className="text-lg text-primary font-bold">{details.priceText}</div>
                      <p className={`text-xs ${details.isPopular ? 'text-on-surface' : 'text-on-surface-variant'} mt-3 leading-relaxed`}>{details.description}</p>
                    </div>

                    <ul className="space-y-4 mb-8 flex-grow">
                      {details.features.map((feat: string, i: number) => (
                        <li key={i} className={`flex items-start gap-2 ${details.isPopular ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                          <CheckCircle2 className="text-primary w-4 h-4 mt-0.5" fill={details.isPopular ? "currentColor" : "none"} />
                          <span className="text-xs leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <div className={`pt-4 border-t ${details.isPopular ? 'border-primary/20' : 'border-outline-variant/10'} mb-8 mt-auto`}>
                      <div className="text-[10px] font-bold text-white uppercase tracking-wider mb-3">Advantages</div>
                      <ul className="space-y-2">
                        {details.advantages.map((adv: string, i: number) => (
                          <li key={i} className={`text-[11px] flex items-center gap-2 ${details.isPopular ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                            <div className={`w-1 h-1 rounded-full ${details.isPopular ? 'bg-primary' : 'bg-primary/50'}`}></div>
                            {adv}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <button 
                      onClick={() => { setSelectedPkgIdx(idx); reset(); }}
                      className={`block w-full py-3.5 rounded-lg font-bold tracking-widest uppercase text-[10px] transition-all text-center ${details.isPopular ? 'bg-primary text-on-primary hover:shadow-lg hover:shadow-primary/20' : 'border border-outline-variant/30 text-white hover:bg-white/5'}`}
                    >
                      Select Package
                    </button>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-8 w-full">
            <CarouselPrevious className="static inset-auto translate-x-0 translate-y-0 relative border-outline-variant text-on-surface-variant hover:text-white flex-shrink-0" />
            <CarouselNext className="static inset-auto translate-x-0 translate-y-0 relative border-outline-variant text-on-surface-variant hover:text-white flex-shrink-0" />
          </div>
        </Carousel>
      </div>
    );
  }

  if (!selectedPkg) return null;

  return (
    <div className="p-8 pb-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-black text-white">{selectedPkg?.package} Setup</h3>
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

              return (
                <div key={fIdx} className="group flex flex-col gap-2">
                  <Controller
                    name={key}
                    control={control}
                    render={({ field: controllerField, fieldState }) => {
                       const isInvalid = fieldState.invalid;
                       return (
                         <Field data-invalid={isInvalid} className="w-full flex-col gap-2 flex">
                           <FieldLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant group-focus-within:text-primary transition-colors">
                             {field.label} {field.type !== 'file' && '*'}
                           </FieldLabel>
                           
                           {field.type === 'short_text' && (
                             <Input 
                               {...controllerField} 
                               aria-invalid={isInvalid} 
                               className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 rounded-none px-0 py-4 focus-visible:ring-0 focus-visible:border-primary text-white shadow-none text-base" 
                             />
                           )}
                           
                           {field.type === 'long_text' && (
                             <Textarea
                                {...controllerField}
                                aria-invalid={isInvalid}
                                className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 rounded-none px-0 py-4 focus-visible:ring-0 focus-visible:border-primary text-white resize-none shadow-none text-base"
                                rows={3}
                             />
                           )}
                           
                           {field.type === 'date' && (
                             <Input 
                               type="date"
                               {...controllerField} 
                               aria-invalid={isInvalid} 
                               className="bg-transparent border-t-0 border-x-0 border-b border-outline-variant/30 rounded-none px-0 py-4 focus-visible:ring-0 focus-visible:border-primary text-white shadow-none text-base" 
                             />
                           )}
                           
                           {field.type === 'file' && (
                             <Input 
                               type="file"
                               {...(controllerField as any)}
                               value={undefined}
                               onChange={(e) => controllerField.onChange(e.target.files)}
                               aria-invalid={isInvalid}
                               className="bg-transparent border-0 rounded-none px-0 py-3 text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-surface-container-high file:text-white hover:file:bg-surface-container-highest cursor-pointer h-auto shadow-none"
                             />
                           )}
                           
                           {field.type === 'select' && (field as any).options && (
                             <Select onValueChange={controllerField.onChange} defaultValue={controllerField.value}>
                               <SelectTrigger aria-invalid={isInvalid} className="w-full bg-surface-container border-0 border-b border-outline-variant/30 rounded-none py-6 px-4 focus:ring-0 focus:border-primary text-white outline-none shadow-none">
                                 <SelectValue placeholder="Select an option..." />
                               </SelectTrigger>
                               <SelectContent className="bg-surface-container-high border-outline-variant/20 text-white pb-2 pt-2">
                                 {(field as any).options.map((opt: any, oIdx: number) => {
                                   const val = typeof opt === 'object' ? opt.name : opt;
                                   const label = typeof opt === 'object' ? `${opt.name} (+$${opt.price})` : opt;
                                   return <SelectItem className="focus:bg-primary/20 cursor-pointer py-3" key={oIdx} value={val}>{label}</SelectItem>
                                 })}
                               </SelectContent>
                             </Select>
                           )}

                           {field.type === 'multiselect' && (field as any).options && (
                             <FieldGroup className="flex flex-wrap gap-3 mt-2" data-slot="checkbox-group">
                               {(field as any).options.map((opt: any, oIdx: number) => {
                                 const val = typeof opt === 'object' ? opt.name : opt;
                                 const label = typeof opt === 'object' ? `${opt.name} (+$${opt.price})` : opt;
                                 const isChecked = controllerField.value?.includes(val);
                                 
                                 return (
                                   <Field key={oIdx} orientation="horizontal" className="flex items-center gap-3 bg-surface-container-high/50 p-4 rounded-xl border border-outline-variant/10 hover:border-primary/50 transition-colors w-full sm:w-auto min-w-[200px]">
                                     <Checkbox 
                                       id={`${key}-${oIdx}`}
                                       className="border-outline-variant/50 rounded-md data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                       checked={isChecked}
                                       onCheckedChange={(checked) => {
                                         const next = checked
                                           ? [...(controllerField.value || []), val]
                                           : (controllerField.value || []).filter((v: string) => v !== val);
                                         controllerField.onChange(next);
                                       }}
                                     />
                                     <FieldLabel htmlFor={`${key}-${oIdx}`} className="text-sm font-bold m-0 cursor-pointer text-white flex-1">
                                       {label}
                                     </FieldLabel>
                                   </Field>
                                 );
                               })}
                             </FieldGroup>
                           )}

                           {isInvalid && <FieldError errors={[fieldState.error]} />}
                         </Field>
                       );
                    }}
                  />
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
                Submit Setup <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
