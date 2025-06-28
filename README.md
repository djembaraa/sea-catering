# SEA Catering Application

### _Aplikasi Katering Sehat - SEA Catering_

This is a full-stack web application built as part of a technical challenge. This app allows users to view meal plans, subscribe, and manage their subscriptions. It also features an admin dashboard to monitor business metrics.

_Ini adalah aplikasi web full-stack yang dibangun sebagai bagian dari tantangan teknis. Aplikasi ini memungkinkan pengguna untuk melihat paket makanan, berlangganan, dan mengelola langganan mereka. Terdapat juga dashboard admin untuk memonitor metrik bisnis._

![Homepage Screenshot](https://storage.googleapis.com/generativeai-downloads/images/2024/6/28/1719545802271816.png)

---

## Built With / _Dibangun Dengan_

This application uses the MERN Stack with modern technologies:
_Aplikasi ini menggunakan MERN Stack dengan teknologi modern:_

- **Frontend:** [Next.js](https://nextjs.org/) (React Framework)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (with Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT)

---

## Getting Started / _Memulai_

Follow these steps to get a local copy up and running.
<br>
_Ikuti langkah-langkah berikut untuk menjalankan salinan lokal proyek ini._

### Prerequisites / _Persiapan Awal_

Make sure you have the following installed on your machine:
<br>
_Sebelum memulai, pastikan Anda sudah menginstal:_

- [Node.js](https://nodejs.org/en/download/) (LTS version is recommended)
- npm (usually comes with Node.js)
- [Git](https://git-scm.com/downloads)

### Installation & Setup / _Instalasi & Setup_

1.  **Clone this repository** / **_Clone repositori ini_**

    ```bash
    git clone [https://github.com/NAMA_ANDA/NAMA_REPO_ANDA.git](https://github.com/NAMA_ANDA/NAMA_REPO_ANDA.git)
    cd NAMA_REPO_ANDA
    ```

2.  **Backend Setup** / **_Setup Backend_**

    - Navigate to the server folder and install dependencies. / _Masuk ke folder server dan install dependencies._
      ```bash
      cd server
      npm install
      ```
    - Create a `.env` file inside the `server` folder. Use the variables below. / _Buat file `.env` di dalam folder `server`. Isi dengan variabel berikut:_
      ```env
      MONGO_URI=mongodb+srv://...
      JWT_SECRET=your_super_secret_key_123!
      ```
    - **IMPORTANT:** Replace `MONGO_URI` with your own Connection String from MongoDB Atlas. / **\*PENTING:** Ganti `MONGO_URI` dengan Connection String dari MongoDB Atlas Anda.\*

3.  **Frontend Setup** / **_Setup Frontend_**
    - Navigate back to the root folder, then install the root dependencies. / _Kembali ke folder root, lalu install dependencies._
      ```bash
      cd ..
      npm install
      ```

---

## How to Run the Application / _Menjalankan Aplikasi_

This application consists of two separate servers that must run concurrently. Open **two separate terminals**.
<br>
_Aplikasi ini terdiri dari dua server yang harus berjalan bersamaan. Buka **dua terminal terpisah**._

1.  **Run the Backend Server** / **_Jalankan Server Backend_**

    - In the first terminal: / _Di terminal pertama:_
      ```bash
      cd server
      node index.js
      ```
    - The backend server will be running on `http://localhost:5000`.

2.  **Run the Frontend Server** / **_Jalankan Server Frontend_**
    - In the second terminal: / _Di terminal kedua:_
      ```bash
      npm run dev
      ```
    - Open your browser and navigate to `http://localhost:3000`.

---

## Creating an Admin Account / _Cara Membuat Akun Admin_

The system does not have a dedicated admin registration page. To create an admin account, follow these manual steps:
<br>
_Sistem tidak memiliki halaman registrasi admin khusus. Untuk membuat akun admin, ikuti langkah-langkah manual berikut:_

1.  **Register a New Account:** Open the application in your browser and register as a normal user via the `/register` page. / _Buka aplikasi di browser dan daftar seperti pengguna biasa melalui halaman `/register`._
2.  **Open MongoDB Atlas:** Log in to your MongoDB Atlas account and click "Browse Collections". / _Login ke akun MongoDB Atlas Anda dan buka "Browse Collections"._
3.  **Select Database & Collection:** Choose your project's database, then select the `users` collection. / _Pilih database proyek Anda, lalu pilih koleksi `users`._
4.  **Find the User:** Find the user document you just registered (based on the email). / _Cari dokumen user yang baru saja Anda daftarkan (berdasarkan email)._
5.  **Edit the Document:** Hover over the document and click the pencil icon (Edit Document). / _Arahkan kursor ke dokumen tersebut dan klik ikon pensil (Edit)._
6.  **Change the `role` field:** Find the `"role": "user"` field and change its value to `"role": "admin"`. / _Cari field `"role": "user"` dan ubah nilainya menjadi `"role": "admin"`._
7.  **Save/Update:** Click the "Update" button to save the changes. / _Klik "Update" untuk menyimpan perubahan._
8.  Now, log back into the application with that account. You will have admin privileges. / _Sekarang, login kembali di aplikasi menggunakan akun tersebut. Anda akan memiliki akses sebagai admin._
