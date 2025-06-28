import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Search, Phone, MessageCircle, CreditCard, Calendar, MapPin, User } from "lucide-react";
import FAQAccordion from "@/components/faq-accordion";

interface InquiryFormData {
  type: string;
  phone: string;
  content: string;
}

export default function FAQ() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [inquiryForm, setInquiryForm] = useState<InquiryFormData>({
    type: "",
    phone: "",
    content: ""
  });

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["/api/faqs", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory ? `/api/faqs?category=${selectedCategory}` : "/api/faqs";
      const response = await fetch(url);
      return response.json();
    },
  });

  const createInquiryMutation = useMutation({
    mutationFn: async (inquiryData: InquiryFormData) => {
      const response = await apiRequest("POST", "/api/inquiries", inquiryData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "문의 접수 완료",
        description: "고객님의 문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.",
      });
      setInquiryForm({
        type: "",
        phone: "",
        content: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/inquiries"] });
    },
    onError: () => {
      toast({
        title: "접수 실패",
        description: "문의 접수 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitInquiry = () => {
    if (!inquiryForm.type || !inquiryForm.content) {
      toast({
        title: "입력 오류",
        description: "문의 유형과 내용을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    createInquiryMutation.mutate(inquiryForm);
  };

  const categories = [
    { value: "결제/환불", icon: CreditCard, color: "text-green-600" },
    { value: "예약관련", icon: Calendar, color: "text-blue-600" },
    { value: "여행정보", icon: MapPin, color: "text-purple-600" },
    { value: "계정관리", icon: User, color: "text-orange-600" }
  ];

  const filteredFAQs = faqs.filter((faq: any) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">고객센터</h1>
          <p className="text-xl text-gray-600">
            궁금한 점이 있으시면 언제든지 문의해주세요
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            <Input
              placeholder="궁금한 내용을 검색해보세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-4 text-lg"
            />
          </div>
        </div>

        {/* Quick Help Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {categories.map((category) => (
            <Card 
              key={category.value}
              className={`p-4 text-center hover:shadow-md transition-shadow cursor-pointer ${
                selectedCategory === category.value ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedCategory(
                selectedCategory === category.value ? "" : category.value
              )}
            >
              <CardContent className="p-0">
                <category.icon className={`h-8 w-8 mx-auto mb-2 ${category.color}`} />
                <div className="text-sm font-medium">{category.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  자주 묻는 질문
                  {selectedCategory && (
                    <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                      {selectedCategory}
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  고객님들이 자주 궁금해하시는 내용들을 모았습니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <FAQAccordion faqs={filteredFAQs} />
                )}
                
                {filteredFAQs.length === 0 && !isLoading && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>검색 결과가 없습니다</p>
                    <p className="text-sm mt-1">다른 검색어로 시도해보시거나 1:1 문의를 이용해주세요</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  1:1 문의하기
                </CardTitle>
                <CardDescription>
                  원하는 답변을 찾지 못하셨나요? 직접 문의해주세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="inquiryType">문의 유형</Label>
                  <Select onValueChange={(value) => setInquiryForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="문의 유형을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="예약 관련">예약 관련</SelectItem>
                      <SelectItem value="결제/환불">결제/환불</SelectItem>
                      <SelectItem value="여행 정보">여행 정보</SelectItem>
                      <SelectItem value="기타">기타</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="phone">연락처 (선택사항)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="연락 가능한 전화번호"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="content">문의 내용</Label>
                  <Textarea
                    id="content"
                    rows={6}
                    placeholder="문의하실 내용을 자세히 적어주세요"
                    value={inquiryForm.content}
                    onChange={(e) => setInquiryForm(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>

                <Button 
                  onClick={handleSubmitInquiry}
                  disabled={createInquiryMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {createInquiryMutation.isPending ? "접수 중..." : "문의 접수"}
                </Button>

                <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
                  <p className="font-medium mb-1">📞 긴급 연락처</p>
                  <p>전화: 1588-0000</p>
                  <p>운영시간: 09:00 - 18:00 (주말/공휴일 휴무)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
