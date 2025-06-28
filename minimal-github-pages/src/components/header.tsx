import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Plane } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "여행 계획", href: "/travel-plan" },
    { name: "예산 관리", href: "/budget" },
    { name: "여행 후기", href: "/reviews" },
    { name: "고객센터", href: "/faq" }
  ];

  const isActive = (href: string) => location === href;

  return (
    <header className="bg-white shadow-sm border-b-2 border-blue-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="text-2xl font-bold text-blue-600 cursor-pointer flex items-center gap-2">
                <Plane className="h-6 w-6" />
                YOLO
              </div>
            </Link>
            <nav className="hidden md:ml-8 md:flex space-x-8">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <a 
                    className={`transition-colors ${
                      isActive(item.href)
                        ? 'text-blue-600 font-medium'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button 
                variant="outline" 
                className="hidden md:block border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                로그인
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">
                회원가입
              </Button>
            </Link>
            
            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <a 
                        className={`block px-3 py-2 rounded transition-colors ${
                          isActive(item.href)
                            ? 'bg-blue-100 text-blue-600 font-medium'
                            : 'text-gray-700 hover:bg-blue-50'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </a>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
