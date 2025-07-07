#!/bin/bash

# Script de configuración para desarrollo - Draw Folder Structure Extension
# Este script ayuda a configurar el entorno de desarrollo rápidamente

echo "🚀 Configurando entorno de desarrollo para Draw Folder Structure Extension"
echo "=================================================================="

# Verificar si existe package.json
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Verificar si existe env.example
if [ ! -f "env.example" ]; then
    echo "❌ Error: No se encontró env.example"
    exit 1
fi

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    echo "🔧 Creando archivo .env desde env.example..."
    cp env.example .env
    echo "✅ Archivo .env creado"
    echo ""
    echo "📝 OPCIONAL: Edita el archivo .env y configura tu connection string para probar la telemetría"
    echo "   El archivo .env está en .gitignore y no se subirá al repositorio"
else
    echo "⚠️  El archivo .env ya existe, no se sobrescribirá"
fi

# Compilar el proyecto
echo "🔨 Compilando proyecto..."
npm run compile

# Verificar .gitignore
if grep -q "\.env" .gitignore; then
    echo "✅ .env está correctamente incluido en .gitignore"
else
    echo "⚠️  ADVERTENCIA: .env no está en .gitignore"
fi

echo ""
echo "🎉 ¡Configuración completa!"
echo ""
echo "Próximos pasos:"
echo "1. Edita .env si quieres configurar telemetría (opcional)"
echo "2. Ejecuta 'npm run watch' para desarrollo en tiempo real"
echo "3. Presiona F5 en VS Code para probar la extensión"
echo ""
echo "Para más información, consulta CONTRIBUTING.md" 