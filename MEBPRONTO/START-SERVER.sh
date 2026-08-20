#!/bin/bash

# MEB - Servidor Local de Desenvolvimento
# Inicia um servidor HTTP na porta 8080

echo "🚀 Iniciando MEB - Servidor Local"
echo "=================================="
echo ""
echo "📍 Seu sistema estará em: http://localhost:8080"
echo ""
echo "🔐 Login:"
echo "   Email: testenutri@meb.com.br"
echo "   Senha: SenhaForte123!"
echo ""
echo "Pressione Ctrl+C para parar o servidor"
echo ""

# Inicia servidor HTTP na porta 8080
python3 -m http.server 8080 --directory .
