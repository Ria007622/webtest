import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  if (faqs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>FAQ가 없습니다.</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {faqs.map((faq) => (
        <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
          <AccordionTrigger className="text-left hover:no-underline hover:bg-gray-50 px-4 py-4 rounded">
            <span className="font-medium">{faq.question}</span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            {faq.category && (
              <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {faq.category}
              </span>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
