import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdf-lib'],
  outputFileTracingIncludes: {'/*':['./node_modules/pdf-lib/**/*','./node_modules/@pdf-lib/**/*','./node_modules/tslib/**/*','./node_modules/pako/**/*']},
  experimental: {
    ...(process.env.LOCAL_LOW_MEMORY_BUILD==='1'?{useTypeScriptCli:true,cpus:1,turbopackMemoryEviction:'full' as const}:{}),
    serverActions: {bodySizeLimit:'11mb'},
  },
  allowedDevOrigins: ['127.0.0.1'],
  turbopack: {
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'urbandictionary.store',
        port: '',
        pathname: '/**',
      }
    ],
  },
  async redirects() {
    return [
       {
        source: '/autor',
        destination: '/autoren',
        permanent: true,
      },
      {
        source: '/autor/:slug*',
        destination: '/autoren/:slug*',
        permanent: true,
      },
      {
        source: '/autoren',
        destination: '/ueber/autoren',
        permanent: true,
      },
      {
        source: '/wiki/:path*',
        destination: '/ratgeber',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
