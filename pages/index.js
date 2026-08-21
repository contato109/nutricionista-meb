import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

    useEffect(() => {
        // Redireciona para o painel principal
            router.replace('/html/otimizado/___PAINEL_NUTRI.html');
              }, [router]);

                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                          <p>Carregando painel nutritivo...</p>
                              </div>
                                );
                                }
