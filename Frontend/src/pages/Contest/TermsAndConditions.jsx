import React from "react";
import { motion } from "framer-motion";

const TermsAndConditions = () => {
  const sections = [
    {
      title: "Coupon Terms",
      items: [
        { text: "Each winner receives a unique coupon code.", highlight: "unique coupon code" },
        { text: "The coupon offers ₹50 off on a minimum order value of ₹500 or more on all medicine and OTC products.", highlight: "₹50 off" },
        { text: "The coupon is valid for a single-use only on sastasundar.com.", highlight: "single-use only" },
        { text: "Persistence: These coupons remain valid indefinitely unless otherwise stated.", highlight: "indefinitely" },
        { text: "Regional Limitation: Coupons are valid for use only in the state of West Bengal.", highlight: "West Bengal" },
      ]
    },
    {
      title: "Additional Notes",
      items: [
        { text: "TreeCampus and SastaSundar reserve the right to modify or cancel this offer at any time without prior notice." },
        { text: "Coupons are non-transferable, not redeemable for cash, and cannot be exchanged or resold.", highlight: "non-transferable" },
        { text: "Misuse of coupon codes or violation of these terms may result in disqualification." },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto pt-4 pb-20">
      <div className="bg-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-sm">
        <div className="mb-12 border-b border-gray-50 pb-8">
            <h1 className="text-3xl font-bold text-slate-900">Information & Terms</h1>
            <p className="text-slate-400 text-sm mt-2">Official guidelines for participation and rewards.</p>
        </div>

        <div className="space-y-12">
          <div className="bg-slate-50 p-6 rounded-xl text-sm border border-slate-100">
            <p className="text-slate-600 leading-relaxed">
              These terms apply to the ongoing TreeCampus Contest, hosted on{" "}
              <a href="https://contest.treecampus.in" className="text-blue-600 font-bold hover:underline">contest.treecampus.in</a>
              {" "}in collaboration with{" "}
              <a href="https://sastasundar.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">SastaSundar.com</a>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-slate-900 rounded-full"></span>
                  {section.title}
                </h2>
                <ul className="space-y-4">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-slate-600 text-sm leading-relaxed">
                      <span className="mt-2 w-1 h-1 rounded-full bg-slate-300 shrink-0"></span>
                      <span>
                        {item.highlight ? (
                          <>
                            {item.text.split(item.highlight).map((part, index, array) => (
                              <React.Fragment key={index}>
                                {part}
                                {index < array.length - 1 && <span className="text-slate-900 font-bold">{item.highlight}</span>}
                              </React.Fragment>
                            ))}
                          </>
                        ) : item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-gray-50 text-center">
            <p className="text-slate-400 text-xs font-medium">
              Support: <a href="mailto:contact@treecampus.in" className="text-blue-600 hover:underline">contact@treecampus.in</a>
            </p>
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-4">Version 1.2 • April 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
