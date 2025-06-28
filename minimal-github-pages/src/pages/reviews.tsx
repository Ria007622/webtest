import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Star, Plus, Search } from "lucide-react";
import ReviewCard from "@/components/review-card";

interface ReviewFormData {
  title: string;
  content: string;
  rating: number;
  destination: string;
  author: string;
}

export default function Reviews() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    title: "",
    content: "",
    rating: 5,
    destination: "",
    author: ""
  });

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["/api/reviews"],
  });

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      const response = await apiRequest("POST", "/api/reviews", reviewData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "후기 작성 완료",
        description: "소중한 여행 후기가 등록되었습니다.",
      });
      setIsDialogOpen(false);
      setReviewForm({
        title: "",
        content: "",
        rating: 5,
        destination: "",
        author: ""
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
    },
    onError: () => {
      toast({
        title: "작성 실패",
        description: "후기 작성 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitReview = () => {
    if (!reviewForm.title || !reviewForm.content || !reviewForm.destination || !reviewForm.author) {
      toast({
        title: "입력 오류",
        description: "모든 필수 정보를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    createReviewMutation.mutate({
      ...reviewForm,
      userId: 1, // 임시 사용자 ID
    });
  };

  const handleRatingChange = (rating: number) => {
    setReviewForm(prev => ({ ...prev, rating }));
  };

  const filteredReviews = reviews.filter((review: any) => 
    review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">여행 후기</h1>
            <p className="text-xl text-gray-600">
              다른 여행자들의 생생한 경험을 확인하고 나만의 후기도 남겨보세요
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                후기 작성하기
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>여행 후기 작성</DialogTitle>
                <DialogDescription>
                  다른 여행자들에게 도움이 되는 생생한 후기를 작성해주세요
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">제목</Label>
                  <Input
                    id="title"
                    placeholder="여행 후기 제목을 입력하세요"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="destination">여행지</Label>
                    <Input
                      id="destination"
                      placeholder="어디로 다녀오셨나요?"
                      value={reviewForm.destination}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, destination: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="author">작성자</Label>
                    <Input
                      id="author"
                      placeholder="닉네임을 입력하세요"
                      value={reviewForm.author}
                      onChange={(e) => setReviewForm(prev => ({ ...prev, author: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>평점</Label>
                  <div className="flex items-center space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingChange(star)}
                        className={`text-2xl transition-colors ${
                          star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        <Star className="h-6 w-6 fill-current" />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({reviewForm.rating}.0)</span>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="content">후기 내용</Label>
                  <Textarea
                    id="content"
                    rows={6}
                    placeholder="여행에 대한 솔직한 후기를 작성해주세요..."
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    취소
                  </Button>
                  <Button 
                    onClick={handleSubmitReview}
                    disabled={createReviewMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {createReviewMutation.isPending ? "작성 중..." : "후기 등록"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="후기 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Reviews Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review: any) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

        {filteredReviews.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Star className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">
              {searchQuery ? "검색 결과가 없습니다" : "아직 등록된 후기가 없습니다"}
            </p>
            <p className="text-gray-400 mt-2">첫 번째 후기를 작성해보세요!</p>
          </div>
        )}

        {/* Load More */}
        {filteredReviews.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              더 많은 후기 보기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
