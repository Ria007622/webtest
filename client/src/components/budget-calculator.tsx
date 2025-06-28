import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Calculator, DollarSign, PieChart } from "lucide-react";

interface BudgetData {
  accommodation: number;
  food: number;
  transport: number;
  others: number;
}

export default function BudgetCalculator() {
  const { toast } = useToast();
  const [budget, setBudget] = useState<BudgetData>({
    accommodation: 0,
    food: 0,
    transport: 0,
    others: 0
  });

  const total = budget.accommodation + budget.food + budget.transport + budget.others;

  const categories = [
    { 
      key: 'accommodation' as keyof BudgetData, 
      name: '숙박비', 
      color: 'bg-blue-500',
      percentage: total > 0 ? (budget.accommodation / total) * 100 : 0
    },
    { 
      key: 'food' as keyof BudgetData, 
      name: '식비', 
      color: 'bg-green-500',
      percentage: total > 0 ? (budget.food / total) * 100 : 0
    },
    { 
      key: 'transport' as keyof BudgetData, 
      name: '교통비', 
      color: 'bg-yellow-500',
      percentage: total > 0 ? (budget.transport / total) * 100 : 0
    },
    { 
      key: 'others' as keyof BudgetData, 
      name: '기타 비용', 
      color: 'bg-purple-500',
      percentage: total > 0 ? (budget.others / total) * 100 : 0
    }
  ];

  const handleInputChange = (key: keyof BudgetData, value: string) => {
    const numValue = parseInt(value.replace(/[^\d]/g, '')) || 0;
    setBudget(prev => ({
      ...prev,
      [key]: numValue
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount);
  };

  const handleSaveBudget = () => {
    if (total === 0) {
      toast({
        title: "입력 오류",
        description: "예산을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "예산 계획 저장 완료",
      description: `총 ${formatCurrency(total)}의 예산이 저장되었습니다.`,
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          예산 계획
        </CardTitle>
        <CardDescription>
          여행 예산을 카테고리별로 계획하고 관리하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Budget Input */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              예산 입력
            </h3>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.key}>
                  <Label htmlFor={category.key}>{category.name}</Label>
                  <div className="relative">
                    <Input
                      id={category.key}
                      type="text"
                      placeholder="0"
                      value={budget[category.key] > 0 ? budget[category.key].toLocaleString() : ''}
                      onChange={(e) => handleInputChange(category.key, e.target.value)}
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-3 text-gray-500">원</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Budget Analysis */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              예산 분석
            </h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">총 예산</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
              
              {/* Budget Breakdown */}
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{category.name}</span>
                      <span>
                        {formatCurrency(budget[category.key])} ({category.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress 
                      value={category.percentage} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Button 
                  onClick={handleSaveBudget}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  예산 계획 저장
                </Button>
              </div>

              {total > 0 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">💡 예산 팁</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• 숙박비는 전체 예산의 30-40%가 적정합니다</li>
                    <li>• 식비는 25-35% 정도로 계획하세요</li>
                    <li>• 예상치 못한 비용을 위해 10% 여유분을 두세요</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
