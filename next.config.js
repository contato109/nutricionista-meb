/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
        compress: true,
        productionBrowserSourceMaps: false,
        poweredByHeader: false,
        async headers() {
    return [
{
        source: '/:path*',
                  headers: [
          {
                      key: 'X-DNS-Prefetch-Control',
                                    value: 'on'
                        },
{
            key: 'Strict-Transport-Security',
                          value: 'max-age=31536000; includeSubDomains'
              }
        ],
},
          ];
    },
        async redirects() {
    return [
{
        source: '/dashboard',
                  destination: '/html/otimizado/_DASHBOARD_KPIS.html',
                  permanent: false,
          },
          ];
    },
        env: {
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
      },
        images: {
    unoptimized: true,
      },
    };

module.exports = nextConfig;
