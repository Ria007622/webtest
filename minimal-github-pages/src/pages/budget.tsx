import BudgetCalculator from "@/components/budget-calculator";

export default function Budget() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            예산 계획
          </h1>
          <p className="text-xl text-gray-600">
            체계적인 여행 예산 관리로 경제적인 여행을 계획하세요
          </p>
        </div>

        <BudgetCalculator />
      </div>
    </div>
  );
}
