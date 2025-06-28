import { Link } from "wouter";
import { Plane, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold text-blue-400 mb-4">
              <Plane className="h-6 w-6" />
              YOLO
            </div>
            <p className="text-gray-400 text-sm mb-4">
              AI가 도와주는 스마트한 여행 계획 서비스
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">서비스</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/travel-plan">
                  <a className="hover:text-white transition-colors">여행 계획</a>
                </Link>
              </li>
              <li>
                <Link href="/budget">
                  <a className="hover:text-white transition-colors">예산 관리</a>
                </Link>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">숙소 예약</a></li>
              <li><a href="#" className="hover:text-white transition-colors">항공권 예약</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">고객지원</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/faq">
                  <a className="hover:text-white transition-colors">자주 묻는 질문</a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="hover:text-white transition-colors">1:1 문의</a>
                </Link>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">이용약관</a></li>
              <li><a href="#" className="hover:text-white transition-colors">개인정보처리방침</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">연락처</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>이메일: support@yolo.co.kr</li>
              <li>전화: 1588-0000</li>
              <li>운영시간: 09:00 - 18:00</li>
              <li>주말/공휴일 휴무</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 YOLO Travel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
