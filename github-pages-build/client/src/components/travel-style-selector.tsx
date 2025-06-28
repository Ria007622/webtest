import { Card } from "@/components/ui/card";
import { 
  TreePine, 
  UtensilsCrossed, 
  Mountain, 
  Building2, 
  Flower,
  ShoppingBag
} from "lucide-react";

interface TravelStyleSelectorProps {
  onStyleSelect: (style: string) => void;
  selectedStyle: string;
}

export default function TravelStyleSelector({ onStyleSelect, selectedStyle }: TravelStyleSelectorProps) {
  const styles = [
    { id: "healing", name: "힐링", icon: Flower, description: "자연 속에서 편안한 휴식" },
    { id: "food", name: "맛집", icon: UtensilsCrossed, description: "현지 음식과 미식 탐험" },
    { id: "adventure", name: "모험", icon: Mountain, description: "스릴 넘치는 액티비티" },
    { id: "culture", name: "문화", icon: Building2, description: "역사와 문화유산 탐방" },
    { id: "nature", name: "자연", icon: TreePine, description: "자연경관과 생태 체험" },
    { id: "shopping", name: "쇼핑", icon: ShoppingBag, description: "쇼핑과 도시 문화" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {styles.map((style) => (
        <Card
          key={style.id}
          className={`p-4 text-center cursor-pointer transition-all hover:shadow-md ${
            selectedStyle === style.id 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-blue-50 text-blue-900 hover:bg-blue-100 border-transparent'
          }`}
          onClick={() => onStyleSelect(style.id)}
        >
          <style.icon className="h-8 w-8 mx-auto mb-2" />
          <div className="font-medium">{style.name}</div>
          <div className="text-xs mt-1 opacity-80">{style.description}</div>
        </Card>
      ))}
    </div>
  );
}
