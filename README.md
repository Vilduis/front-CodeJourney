# CodeJourney

Plataforma web para compartir y discutir posts sobre programación. Los usuarios pueden publicar artículos con imágenes, comentar y gestionar su perfil.

## Qué hace

- Página de inicio con presentación de la plataforma
- Feed público con todos los posts de la comunidad
- Crear, editar y eliminar posts propios (con imagen)
- Comentar en posts de otros usuarios
- Registro, login y edición de perfil
- Rutas protegidas según estado de autenticación

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Estilos | Tailwind CSS + Radix UI |
| Animaciones | Framer Motion |
| Formularios | React Hook Form + Zod |
| HTTP | Axios |
| Notificaciones | Sonner |
| Temas | next-themes (dark/light) |

## Páginas

```
/                  Inicio
/about             Acerca de
/login             Iniciar sesión
/register          Registro
/posts             Feed de posts
/posts/[id]        Detalle de un post con comentarios
/posts/createpost  Crear post y gestionar los propios
```

## Instalación local

```bash
# Instalar dependencias
npm install

# Copiar y completar las variables de entorno
cp .env.example .env

# Iniciar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Variables de entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
