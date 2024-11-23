/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    // assetPrefix: './', // 정적 파일을 상대 경로로 참조
    basePath: '',      // 기본 경로 설정 (빈 문자열로 두면 root 기준으로 빌드)
};

export default nextConfig;
