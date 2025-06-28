#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 GitHub Pages 배포용 정적 사이트 준비 중...');

// 1. 정적 빌드 디렉토리 생성
const buildDir = 'github-pages-build';
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true });
}
fs.mkdirSync(buildDir);

// 2. 클라이언트 파일 복사
console.log('📁 클라이언트 파일 복사 중...');
function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 클라이언트 폴더 복사
copyRecursive('client', path.join(buildDir, 'client'));

// shared 폴더 복사 (필요한 타입들)
if (fs.existsSync('shared')) {
  copyRecursive('shared', path.join(buildDir, 'shared'));
}

// attached_assets 폴더 복사
if (fs.existsSync('attached_assets')) {
  copyRecursive('attached_assets', path.join(buildDir, 'attached_assets'));
}

// 3. 설정 파일들 복사
console.log('⚙️ 설정 파일 복사 중...');
const configFiles = [
  'vite.config.static.ts',
  'package.static.json',
  'tailwind.config.ts',
  'tsconfig.json',
  'components.json',
  'postcss.config.js'
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    if (file === 'package.static.json') {
      fs.copyFileSync(file, path.join(buildDir, 'package.json'));
    } else if (file === 'vite.config.static.ts') {
      fs.copyFileSync(file, path.join(buildDir, 'vite.config.ts'));
    } else {
      fs.copyFileSync(file, path.join(buildDir, file));
    }
  }
});

// 4. README 파일 생성
console.log('📝 README 파일 생성 중...');
const readmeContent = `# YOLO Travel Planning Application

이 프로젝트는 GitHub Pages에서 호스팅되는 정적 버전의 YOLO 여행 계획 웹사이트입니다.

## 특징

- 🏖️ **여행 스타일 선택**: 힐링, 맛집, 모험, 문화, 자연, 쇼핑
- 💰 **예산 계산기**: 실시간 예산 관리 및 시각화
- ⭐ **여행 후기**: 사용자 리뷰 및 평점 시스템
- 🤔 **FAQ/고객센터**: 자주 묻는 질문 및 문의하기
- 🔐 **회원 시스템**: 로그인/회원가입 (로컬 저장소 기반)

## 체험 계정

- 아이디: demo
- 비밀번호: demo123

## 로컬 실행

\`\`\`bash
npm install
npm run dev
\`\`\`

## 빌드

\`\`\`bash
npm run build
\`\`\`

## 기술 스택

- React + TypeScript
- Tailwind CSS + shadcn/ui
- Vite
- LocalStorage (데이터 저장)

## 배포

이 프로젝트는 GitHub Pages에서 정적 사이트로 호스팅됩니다.
`;

fs.writeFileSync(path.join(buildDir, 'README.md'), readmeContent);

// 5. .gitignore 파일 생성
const gitignoreContent = `node_modules
dist
.DS_Store
*.log
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
`;

fs.writeFileSync(path.join(buildDir, '.gitignore'), gitignoreContent);

// 6. GitHub Actions 워크플로 생성
console.log('🔧 GitHub Actions 워크플로 생성 중...');
const workflowsDir = path.join(buildDir, '.github', 'workflows');
fs.mkdirSync(workflowsDir, { recursive: true });

const workflowContent = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

fs.writeFileSync(path.join(workflowsDir, 'deploy.yml'), workflowContent);

// 7. index.html 파일 수정 (GitHub Pages 경로에 맞게)
console.log('🔧 index.html 파일 수정 중...');
const indexPath = path.join(buildDir, 'client', 'index.html');
if (fs.existsSync(indexPath)) {
  let indexContent = fs.readFileSync(indexPath, 'utf8');
  
  // base 태그 추가
  indexContent = indexContent.replace(
    '<head>',
    '<head>\n    <base href="/webtest/Home/">'
  );
  
  fs.writeFileSync(indexPath, indexContent);
}

// 8. 사용법 안내 파일 생성
const instructionsContent = `# GitHub Pages 배포 안내

## 1. 빌드된 파일 확인
- \`${buildDir}\` 폴더에 GitHub Pages용 파일들이 준비되었습니다.

## 2. GitHub 저장소 설정
1. 이 폴더의 내용을 GitHub 저장소에 업로드하세요
2. Repository Settings > Pages로 이동
3. Source를 "GitHub Actions"로 설정

## 3. 배포 주소
배포가 완료되면 다음 주소에서 사이트를 확인할 수 있습니다:
https://ria007622.github.io/webtest/Home/

## 4. 체험 계정
- 아이디: demo
- 비밀번호: demo123

## 주의사항
- 모든 데이터는 브라우저의 로컬 저장소에 저장됩니다
- 브라우저 데이터를 지우면 저장된 정보가 삭제됩니다
- 정적 사이트이므로 서버 기능은 클라이언트에서 시뮬레이션됩니다
`;

fs.writeFileSync(path.join(buildDir, 'DEPLOYMENT_INSTRUCTIONS.md'), instructionsContent);

console.log('✅ GitHub Pages 배포 준비 완료!');
console.log(`📁 빌드 파일 위치: ${buildDir}`);
console.log('📋 다음 단계:');
console.log('  1. github-pages-build 폴더의 내용을 GitHub 저장소에 업로드');
console.log('  2. Repository Settings > Pages에서 GitHub Actions 활성화');
console.log('  3. 배포 완료 후 https://ria007622.github.io/webtest/Home/ 에서 확인');