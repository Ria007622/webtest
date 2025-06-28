import HeroSection from "@/components/hero-section";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Plane, Calendar, MapPin, Star, Users, DollarSign } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();

  const features = [
    {
      icon: <Plane className="h-8 w-8 text-blue-600" />,
      title: "AI 맞춤 여행 계획",
      description: "당신의 스타일에 맞는 완벽한 여행 일정을 AI가 제안해드립니다"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      title: "똑똑한 예산 관리",
      description: "카테고리별 예산 계획과 실시간 지출 추적으로 경제적인 여행을"
    },
    {
      icon: <Star className="h-8 w-8 text-yellow-600" />,
      title: "실제 여행 후기",
      description: "다른 여행자들의 생생한 후기와 평점으로 더 나은 선택을"
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "24시간 고객지원",
      description: "언제든지 궁금한 점이 있으면 전문 상담원이 도와드립니다"
    }
  ];

  return (
    <div className="space-y-16">
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              왜 <span className="text-blue-600">YOLO</span>를 선택해야 할까요?
            </h2>
            <p className="text-xl text-gray-600">
              더 스마트하고 편리한 여행 계획 서비스를 경험해보세요
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            지금 바로 시작해보세요
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" 
                  onClick={() => navigate("/travel-plan")}>
              <div className="flex flex-col items-center space-y-4">
                <Calendar className="h-12 w-12 text-blue-600" />
                <h3 className="text-xl font-semibold">여행 계획 세우기</h3>
                <p className="text-gray-600">AI가 도와주는 맞춤형 여행 일정</p>
                <Button className="bg-blue-600 hover:bg-blue-700">시작하기</Button>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate("/budget")}>
              <div className="flex flex-col items-center space-y-4">
                <DollarSign className="h-12 w-12 text-green-600" />
                <h3 className="text-xl font-semibold">예산 계획하기</h3>
                <p className="text-gray-600">체계적인 여행 예산 관리</p>
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                  계산해보기
                </Button>
              </div>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate("/reviews")}>
              <div className="flex flex-col items-center space-y-4">
                <Star className="h-12 w-12 text-yellow-600" />
                <h3 className="text-xl font-semibold">후기 둘러보기</h3>
                <p className="text-gray-600">다른 여행자들의 생생한 경험</p>
                <Button variant="outline" className="border-yellow-600 text-yellow-600 hover:bg-yellow-50">
                  둘러보기
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
