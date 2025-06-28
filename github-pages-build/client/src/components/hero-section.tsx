import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TravelStyleSelector from "@/components/travel-style-selector";

export default function HeroSection() {
  const [, navigate] = useLocation();
  const [selectedStyle, setSelectedStyle] = useState("");

  const handleStartPlanning = () => {
    if (selectedStyle) {
      navigate(`/travel-plan?style=${selectedStyle}`);
    } else {
      navigate("/travel-plan");
    }
  };

  return (
    <section className="relative py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          당신만의 <span className="text-blue-600">완벽한 여행</span>을<br />계획해보세요
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          AI가 도와주는 맞춤형 여행 계획으로 잊지 못할 추억을 만들어보세요
        </p>
        
        {/* Travel Style Selection */}
        <Card className="p-8 mb-12 bg-white/80 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">당신의 여행 스타일은?</h2>
          <TravelStyleSelector 
            onStyleSelect={setSelectedStyle} 
            selectedStyle={selectedStyle}
          />
          <Button 
            onClick={handleStartPlanning}
            className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium"
            size="lg"
          >
            맞춤 여행 계획 시작하기
          </Button>
        </Card>
      </div>
    </section>
  );
}
