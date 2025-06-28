import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface Review {
  id: number;
  title: string;
  content: string;
  rating: number;
  destination: string;
  author: string;
  createdAt: Date;
}

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-gray-300" />
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 absolute top-0 left-0 overflow-hidden" style={{ width: '50%' }} />
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  const getDestinationImage = (destination: string) => {
    // 여행지별 대표 이미지 매핑
    const imageMap: { [key: string]: string } = {
      '제주도': 'https://images.unsplash.com/photo-1522383225653-ed111181a951?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200',
      '서울': 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200',
      '경주': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200',
      '부산': 'https://images.unsplash.com/photo-1524704796725-9fc3044a58b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200'
    };
    
    return imageMap[destination] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=200';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img 
          src={getDestinationImage(review.destination)}
          alt={review.destination}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(review.rating)}
          </div>
          <span className="ml-2 text-sm text-gray-600">{review.rating.toFixed(1)}</span>
          <Badge variant="secondary" className="ml-auto">
            {review.destination}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{review.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {review.content}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {review.author.charAt(0)}
            </div>
            <span className="ml-2 text-sm text-gray-600">{review.author}</span>
          </div>
          <span className="text-xs text-gray-400">
            {new Date(review.createdAt).toLocaleDateString('ko-KR')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
