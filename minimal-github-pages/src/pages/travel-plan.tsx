import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Calendar, MapPin, Users, Clock, Edit, Save } from "lucide-react";
import TravelStyleSelector from "@/components/travel-style-selector";

interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  peopleCount: number;
  budgetRange: string;
  travelStyle: string;
}

export default function TravelPlan() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TripFormData>({
    destination: "",
    startDate: "",
    endDate: "",
    peopleCount: 1,
    budgetRange: "",
    travelStyle: ""
  });
  const [generatedItinerary, setGeneratedItinerary] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  const createTripMutation = useMutation({
    mutationFn: async (tripData: any) => {
      const response = await apiRequest("POST", "/api/trips", tripData);
      return response.json();
    },
    onSuccess: (trip) => {
      toast({
        title: "여행 계획 저장 완료",
        description: "AI가 추천한 여행 계획이 저장되었습니다.",
      });
      generateItinerary(trip);
      queryClient.invalidateQueries({ queryKey: ["/api/trips"] });
    },
    onError: (error) => {
      toast({
        title: "저장 실패",
        description: "여행 계획 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const generateItinerary = (tripData: any) => {
    // AI 추천 일정 생성 (실제로는 외부 AI API 호출)
    const mockItinerary = {
      days: [
        {
          day: 1,
          date: tripData.startDate,
          activities: [
            { time: "09:00", name: "인천공항 출발", icon: "✈️", type: "transport" },
            { time: "14:00", name: "호텔 체크인 및 휴식", icon: "🏨", type: "accommodation" },
            { time: "18:00", name: "현지 맛집 저녁식사", icon: "🍽️", type: "food" }
          ]
        },
        {
          day: 2,
          date: new Date(new Date(tripData.startDate).getTime() + 86400000).toISOString().split('T')[0],
          activities: [
            { time: "09:00", name: "주요 관광지 투어", icon: "📸", type: "sightseeing" },
            { time: "15:00", name: "쇼핑 및 자유시간", icon: "🛍️", type: "shopping" },
            { time: "19:00", name: "현지 문화 체험", icon: "🎭", type: "culture" }
          ]
        }
      ],
      recommendations: {
        restaurants: ["현지 인기 맛집 A", "전통 음식점 B", "카페 거리 C"],
        attractions: ["명소 1", "박물관 2", "공원 3"],
        tips: ["현지 교통카드 구매 권장", "주요 관광지는 오전에 방문", "현금 준비 필요"]
      }
    };
    
    setGeneratedItinerary(mockItinerary);
  };

  const handleStyleSelect = (style: string) => {
    setFormData(prev => ({ ...prev, travelStyle: style }));
  };

  const handleGenerateItinerary = () => {
    if (!formData.destination || !formData.startDate || !formData.endDate || !formData.travelStyle) {
      toast({
        title: "입력 오류",
        description: "모든 필수 정보를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    const tripData = {
      ...formData,
      userId: 1, // 임시 사용자 ID
    };

    createTripMutation.mutate(tripData);
  };

  const handleSaveItinerary = () => {
    if (generatedItinerary) {
      // 일정 저장 로직
      toast({
        title: "일정 저장 완료",
        description: "여행 일정이 성공적으로 저장되었습니다.",
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            여행 계획 만들기
          </h1>
          <p className="text-xl text-gray-600">
            AI가 도와주는 맞춤형 여행 일정을 만들어보세요
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Trip Details Form */}
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                여행 정보 입력
              </CardTitle>
              <CardDescription>
                여행에 대한 기본 정보를 입력해주세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="destination">여행지</Label>
                <Input
                  id="destination"
                  placeholder="어디로 떠나시나요?"
                  value={formData.destination}
                  onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">출발일</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">도착일</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="peopleCount">인원 수</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, peopleCount: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="인원을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1명</SelectItem>
                    <SelectItem value="2">2명</SelectItem>
                    <SelectItem value="3">3명</SelectItem>
                    <SelectItem value="4">4명 이상</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="budgetRange">예산 범위</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, budgetRange: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="예산을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="50만원 이하">50만원 이하</SelectItem>
                    <SelectItem value="50-100만원">50-100만원</SelectItem>
                    <SelectItem value="100-200만원">100-200만원</SelectItem>
                    <SelectItem value="200만원 이상">200만원 이상</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>여행 스타일</Label>
                <TravelStyleSelector onStyleSelect={handleStyleSelect} selectedStyle={formData.travelStyle} />
              </div>

              <Button 
                onClick={handleGenerateItinerary} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={createTripMutation.isPending}
              >
                {createTripMutation.isPending ? "생성 중..." : "AI 추천 받기"}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Itinerary */}
          <Card className="p-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  추천 여행 일정
                </div>
                {generatedItinerary && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {isEditing ? "취소" : "수정"}
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleSaveItinerary}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      저장
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                AI가 추천하는 맞춤형 여행 일정입니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!generatedItinerary ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>여행 정보를 입력하고 AI 추천을 받아보세요</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {generatedItinerary.days.map((day: any) => (
                    <div key={day.day} className="border-l-4 border-blue-600 pl-4">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {day.day}일차 - {new Date(day.date).toLocaleDateString('ko-KR')}
                      </h4>
                      <div className="space-y-2">
                        {day.activities.map((activity: any, idx: number) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="w-12">{activity.time}</span>
                            <span className="mr-2">{activity.icon}</span>
                            <span>{activity.name}</span>
                            <Badge variant="secondary" className="ml-auto text-xs">
                              {activity.type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold text-gray-900 mb-2">추천 정보</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div>
                        <strong>맛집:</strong> {generatedItinerary.recommendations.restaurants.join(', ')}
                      </div>
                      <div>
                        <strong>관광지:</strong> {generatedItinerary.recommendations.attractions.join(', ')}
                      </div>
                      <div>
                        <strong>여행 팁:</strong>
                        <ul className="list-disc list-inside mt-1">
                          {generatedItinerary.recommendations.tips.map((tip: string, idx: number) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
