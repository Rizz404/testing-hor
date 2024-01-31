# Dokumentasi API

## URL Dasar

Semua permintaan API dibuat ke: `https://happiness-overload.netlify.app/`

## Allowed Origins

Berikut adalah daftar origin yang diizinkan untuk melakukan permintaan ke API ini:

- `http://localhost:5000`
- `http://localhost:3500`
- `http://localhost:5173`

## Endpoint

### Rute Autentikasi (`auth/`)

- **POST auth/google-login**: Login dengan Google
- **POST auth/register**: Daftarkan pengguna baru
- **POST auth/login**: Login pengguna
- **POST auth/logout**: Logout pengguna

### Rute Komentar (`comments/`)

- **POST comments/create/:postId/:parentId?**: Buat komentar (memerlukan login)
- **GET comments/post/:postId**: Dapatkan komentar untuk postingan
- **GET comments/replies/:commentId**: Dapatkan balasan untuk komentar
- **PATCH comments/upvote/:commentId**: Upvote komentar (memerlukan login)
- **PATCH comments/downvote/:commentId**: Downvote komentar (memerlukan login)
- **GET comments/:commentId**: Dapatkan komentar
- **PATCH comments/:commentId**: Perbarui komentar (memerlukan login)
- **DELETE comments/:commentId**: Hapus komentar (memerlukan login)

### Rute Postingan (`posts/`)

- **GET posts/**: Dapatkan semua postingan
- **POST posts/**: Buat postingan (memerlukan login)
- **GET posts/search**: Cari postingan berdasarkan judul
- **GET posts/saved**: Dapatkan postingan yang disimpan (memerlukan login)
- **GET posts/self**: Dapatkan postingan sendiri (memerlukan login)
- **PATCH posts/save/:postId**: Simpan postingan (memerlukan login)
- **PATCH posts/upvote/:postId**: Upvote postingan (memerlukan login)
- **PATCH posts/downvote/:postId**: Downvote postingan (memerlukan login)
- **GET posts/:postId**: Dapatkan postingan
- **DELETE posts/:postId**: Hapus postingan (memerlukan login)

### Rute Tag (`tags/`)

- **GET tags/**: Dapatkan semua tag
- **POST tags/**: Buat tag (memerlukan login)
- **GET tags/search**: Cari tag berdasarkan nama
- **PATCH tags/follow/:tagId**: Ikuti tag (memerlukan login)
- **PATCH tags/block/:tagId**: Blokir tag (memerlukan login)
- **GET tags/:name**: Dapatkan postingan berdasarkan nama tag
- **GET tags/:tagId**: Dapatkan tag

### Rute Pengguna (`users/`)

- **GET users/**: Dapatkan semua pengguna
- **GET users/profile**: Dapatkan profil pengguna (memerlukan login)
- **PATCH users/profile**: Perbarui profil pengguna (memerlukan login)
- **GET users/following**: Dapatkan pengguna yang diikuti (memerlukan login)
- **GET users/followers**: Dapatkan pengikut (memerlukan login)
- **PATCH users/follow/:userId**: Ikuti pengguna (memerlukan login)
- **GET users/search**: Cari pengguna
- **GET users/:userId**: Dapatkan pengguna berdasarkan ID

## Catatan

- Semua rute yang memerlukan login harus menyertakan JWT yang valid di cookie.
- Parameter `/:postId`, `/:commentId`, `/:tagId`, dan `/:userId` dalam rute harus diganti dengan ID postingan, komentar, tag, atau pengguna yang sebenarnya.
- Parameter `/:parentId?` dalam rute `/create/:postId/:parentId?` bersifat opsional dan hanya harus disertakan ketika komentar adalah balasan untuk komentar lain.
