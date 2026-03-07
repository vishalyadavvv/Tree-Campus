import React from "react";
import { motion } from "framer-motion";
import { FiInfo } from "react-icons/fi";

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
      <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        <div className="mb-12 border-b border-gray-100 pb-10">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Information & Terms</h1>
            <p className="text-gray-400 text-sm mt-3 font-semibold uppercase tracking-widest text-xs">Official guidelines for participation and rewards</p>
        </div>

        <div className="space-y-14">
          <div className="bg-teal-50/50 p-8 rounded-2xl text-sm border border-teal-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-teal-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-teal-600/20">
                <FiInfo size={20} />
            </div>
            <p className="text-teal-900 font-medium leading-relaxed">
              These terms apply to the official TreeCampus Contest, hosted on{" "}
              <a href="https://contest.treecampus.in" className="text-teal-600 font-black hover:underline underline-offset-4">contest.treecampus.in</a>
              {" "}in exclusive collaboration with{" "}
              <a href="https://sastasundar.com" target="_blank" rel="noopener noreferrer" className="text-teal-600 font-black hover:underline underline-offset-4">SastaSundar.com</a>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {sections.map((section, idx) => (
              <div key={idx} className="space-y-8">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-4">
                  <span className="w-2 h-8 bg-[#115E59] rounded-full"></span>
                  {section.title}
                </h2>
                <ul className="space-y-5">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex gap-4 text-gray-600 text-sm leading-relaxed group">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-teal-200 group-hover:bg-teal-500 transition-colors shrink-0"></span>
                      <span className="font-medium">
                        {item.highlight ? (
                          <>
                            {item.text.split(item.highlight).map((part, index, array) => (
                              <React.Fragment key={index}>
                                {part}
                                {index < array.length - 1 && <span className="text-gray-900 font-black border-b-2 border-teal-100">{item.highlight}</span>}
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

          <div className="pt-12 border-t border-gray-100 text-center space-y-4">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              Direct Support: <a href="mailto:contact@treecampus.in" className="text-teal-600 hover:text-[#0F766E] transition-colors underline underline-offset-4">contact@treecampus.in</a>
            </p>
            <div className="inline-block px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Version 1.5 • March 2026 • Revised</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
