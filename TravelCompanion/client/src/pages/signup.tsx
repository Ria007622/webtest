import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plane, ArrowLeft, Eye, EyeOff, CheckCircle } from "lucide-react";

interface SignupFormData {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  phone: string;
  gender: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
}

export default function Signup() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [step, setStep] = useState(1); // 1: 약관동의, 2: 정보입력
  
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    gender: "",
    agreeTerms: false,
    agreePrivacy: false
  });

  const signupMutation = useMutation({
    mutationFn: async (signupData: any) => {
      const response = await apiRequest("POST", "/api/auth/signup", signupData);
      return response.json();
    },
    onSuccess: () => {
      setIsCompleted(true);
    },
    onError: (error: any) => {
      toast({
        title: "회원가입 실패",
        description: error.message || "회원가입 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const validateStep1 = () => {
    if (!formData.agreeTerms || !formData.agreePrivacy) {
      toast({
        title: "약관 동의 필요",
        description: "필수 약관에 모두 동의해주세요.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.username || !formData.password || !formData.confirmPassword || !formData.email) {
      toast({
        title: "입력 오류",
        description: "필수 정보를 모두 입력해주세요.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "비밀번호 불일치",
        description: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "비밀번호 오류",
        description: "비밀번호는 6자 이상이어야 합니다.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    signupMutation.mutate({
      username: formData.username,
      password: formData.password,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender
    });
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="text-center shadow-xl">
            <CardContent className="p-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">회원가입 완료!</h2>
              <p className="text-gray-600 mb-6">
                YOLO에 가입해주셔서 감사합니다.<br />
                이제 맞춤형 여행 계획을 시작하실 수 있습니다.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => navigate("/login")}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  로그인하기
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="w-full"
                >
                  홈페이지로 이동
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 text-4xl font-bold text-blue-600 mb-2">
            <Plane className="h-10 w-10" />
            YOLO
          </div>
          <p className="text-gray-600">AI와 함께하는 스마트한 여행</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="text-sm font-medium">약관 동의</span>
            </div>
            <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="text-sm font-medium">정보 입력</span>
            </div>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              {step === 1 ? "약관 동의" : "회원 정보 입력"}
            </CardTitle>
            <CardDescription>
              {step === 1 
                ? "서비스 이용을 위해 약관에 동의해주세요"
                : "회원가입을 위한 정보를 입력해주세요"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <div className="space-y-6">
                {/* Terms Agreement */}
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, agreeTerms: checked as boolean }))
                        }
                      />
                      <Label htmlFor="agreeTerms" className="font-medium">
                        이용약관 동의 (필수)
                      </Label>
                    </div>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                      <p className="mb-2">제1조 (목적)</p>
                      <p className="mb-2">본 약관은 YOLO 여행 서비스의 이용조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.</p>
                      <p className="mb-2">제2조 (정의)</p>
                      <p>서비스라 함은 회사가 제공하는 모든 여행 관련 서비스를 의미합니다.</p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Checkbox
                        id="agreePrivacy"
                        checked={formData.agreePrivacy}
                        onCheckedChange={(checked) => 
                          setFormData(prev => ({ ...prev, agreePrivacy: checked as boolean }))
                        }
                      />
                      <Label htmlFor="agreePrivacy" className="font-medium">
                        개인정보 수집 및 이용 동의 (필수)
                      </Label>
                    </div>
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                      <p className="mb-2">1. 개인정보 수집 항목</p>
                      <p className="mb-2">필수: 아이디, 비밀번호, 이메일</p>
                      <p className="mb-2">선택: 전화번호, 성별</p>
                      <p className="mb-2">2. 수집 목적</p>
                      <p>서비스 제공, 고객 상담, 맞춤형 여행 추천</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/")}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    취소
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={!formData.agreeTerms || !formData.agreePrivacy}
                  >
                    다음
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">아이디 *</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="아이디를 입력하세요"
                      value={formData.username}
                      onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">이메일 *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="이메일을 입력하세요"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">비밀번호 *</Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="6자 이상 입력하세요"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">비밀번호 확인 *</Label>
                    <div className="relative mt-1">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="비밀번호를 다시 입력하세요"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">휴대폰 번호</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="01012345678"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>성별</Label>
                  <RadioGroup 
                    value={formData.gender} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                    className="flex space-x-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">남성</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">여성</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    이전
                  </Button>
                  <Button 
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={signupMutation.isPending}
                  >
                    {signupMutation.isPending ? "가입 중..." : "회원가입"}
                  </Button>
                </div>

                <div className="text-center">
                  <span className="text-sm text-gray-600">
                    이미 계정이 있으신가요?{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      로그인
                    </button>
                  </span>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}