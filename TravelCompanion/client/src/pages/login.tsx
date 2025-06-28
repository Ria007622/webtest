import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plane, ArrowLeft, Eye, EyeOff } from "lucide-react";

interface LoginFormData {
  username: string;
  password: string;
  autoLogin: boolean;
}

export default function Login() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    autoLogin: false
  });

  const loginMutation = useMutation({
    mutationFn: async (loginData: Omit<LoginFormData, 'autoLogin'>) => {
      const response = await apiRequest("POST", "/api/auth/login", loginData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "로그인 성공",
        description: "YOLO에 오신 것을 환영합니다!",
      });
      navigate("/");
    },
    onError: (error: any) => {
      toast({
        title: "로그인 실패",
        description: error.message || "아이디나 비밀번호를 확인해주세요.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast({
        title: "입력 오류",
        description: "아이디와 비밀번호를 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    loginMutation.mutate({
      username: formData.username,
      password: formData.password
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-4xl font-bold text-blue-600 mb-2">
            <Plane className="h-10 w-10" />
            YOLO
          </div>
          <p className="text-gray-600">AI와 함께하는 스마트한 여행</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">로그인</CardTitle>
            <CardDescription>
              계정에 로그인하여 맞춤형 여행 계획을 시작하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username">아이디</Label>
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
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoLogin"
                  checked={formData.autoLogin}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, autoLogin: checked as boolean }))
                  }
                />
                <Label htmlFor="autoLogin" className="text-sm text-gray-600">
                  자동 로그인
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 py-3"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "로그인 중..." : "로그인"}
              </Button>

              <div className="text-center space-y-4">
                <div className="text-sm text-gray-600">
                  아직 회원이 아니신가요?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    회원가입
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mx-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  홈페이지로 돌아가기
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo Account Info */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="text-center">
              <h4 className="font-medium text-yellow-800 mb-2">🚀 체험 계정</h4>
              <p className="text-sm text-yellow-700 mb-2">
                바로 체험해보시려면 아래 계정을 사용하세요
              </p>
              <div className="text-sm text-yellow-600">
                <p>아이디: <code className="bg-yellow-200 px-1 rounded">demo</code></p>
                <p>비밀번호: <code className="bg-yellow-200 px-1 rounded">demo123</code></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}