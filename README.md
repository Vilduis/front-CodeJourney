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
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Estilos | Tailwind CSS 4 + Radix UI |
| Formularios | React Hook Form + Zod 4 |
| HTTP | Axios |
| Notificaciones | Sonner |

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

## Estructura

```
app/            Rutas (App Router) y server actions
components/
  auth/         Login, registro, perfil
  comments/     Formulario y acciones de comentarios
  home/         Secciones de la portada
  layout/       Navbar y footer
  posts/        Listado, detalle, editor y "Mis posts"
  shared/       Markdown, paginación, avatar
  ui/           Componentes base (shadcn/ui)
contexts/       Estado de sesión (AuthContext)
lib/            Utilidades; lib/server para datos en el servidor
services/       Llamadas a la API desde el navegador
types/          Tipos compartidos
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
API_URL=http://localhost:5000
```
