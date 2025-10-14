# 🧠 Learn Cybersecurity with VunEat  

[![Next.js](https://img.shields.io/badge/Next.js-15.5-blue)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)](https://www.postgresql.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vercel Deploy](https://img.shields.io/badge/Frontend-Vercel-black)](https://vercel.com/)
[![Render Deploy](https://img.shields.io/badge/Backend-Render-purple)](https://render.com/)

---

## 🌐 Live Demo  

- **Frontend:** [learn-cybersecurity-with-vun-eat.vercel.app](https://learn-cybersecurity-with-vun-eat.vercel.app/)  
- **Backend API:** [learn-cybersecurity-with-vuneat.onrender.com](https://learn-cybersecurity-with-vuneat.onrender.com)  

---

## 📘 Overview  

**Learn Cybersecurity with VunEat** is a gamified learning platform where users can:
- Learn cybersecurity fundamentals  
- Identify simulated vulnerabilities  
- Report issues to earn points  
- Compete in a leaderboard system  

Admins can manage users, vulnerabilities, and review submissions.  

This project blends **education and real-world cybersecurity practice** — perfect for beginners who want to explore ethical hacking interactively.

---

## ⚙️ Tech Stack  

### 🖥️ Frontend  
- [Next.js 15 (App Router + TypeScript)](https://nextjs.org/)  
- [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)  
- [Lucide Icons](https://lucide.dev/)  
- Context API for state management  
- Deployed via [Vercel](https://vercel.com/)  

### 🗄️ Backend  
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)  
- [PostgreSQL](https://www.postgresql.org/) for data storage  
- [JWT Authentication](https://jwt.io/) for security  
- [Render](https://render.com/) deployment  
- [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) for frontend-backend integration  

---

## 🧩 Features  

### 👨‍🎓 User Features  
✅ Register & login  
✅ Submit vulnerability reports  
✅ View leaderboard & earned points  
✅ Manage user profile  
✅ Learn through categorized vulnerability examples  

### 🧑‍💼 Admin Features  
⚙️ Manage users & roles  
⚙️ Review and approve/reject reports  
⚙️ Assign points and track leaderboard  
⚙️ Manage system settings  

---

## 🧠 System Architecture  

```

Learn-Cybersecurity-with-VunEat/
│
├── backend/
│   ├── auth.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── .env
│
└── frontend/
├── app/
├── components/
├── context/
├── public/
├── styles/
└── next.config.mjs

````

---

## ⚡ Getting Started  

### 1️⃣ Clone Repository  
```bash
git clone https://github.com/Burashewa/Learn-Cybersecurity-with-VunEat.git
cd Learn-Cybersecurity-with-VunEat
````

### 2️⃣ Setup Backend

```bash
cd backend
npm install
npx nodemon auth.js 
```

Create a `.env` file inside `/backend`:

```env
PORT=5000
DATABASE_URL= your_postgres_connection_string
JWT_SECRET= your_secret_key
```

### 3️⃣ Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Create `.env` file inside `/frontend`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Access app locally at **[http://localhost:3000](http://localhost:3000)**

---

## 🌍 Deployment

### 🔹 Backend

* Hosted on **Render**
* CORS allowed for:

  ```
  https://learn-cybersecurity-with-vun-eat.vercel.app
  http://localhost:3000
  ```

### 🔹 Frontend

* Deployed on **Vercel**
* Environment variable:

  ```env
  NEXT_PUBLIC_API_URL=https://learn-cybersecurity-with-vuneat.onrender.com
  ```

---

## 🏆 Future Enhancements

🚀 AI-assisted vulnerability analysis
📊 Advanced reporting and analytics dashboard
💬 Real-time notifications for report updates
🎯 Gamified learning modules and badges
🌐 Multi-language support

---

## 👨‍💻 Author

**Biruk Shewafera**
💼 Aspiring Full-Stack Developer & Cybersecurity Enthusiast
📧 [Contact Me](mailto:shewabura@gmail.com) 
🔗 [GitHub Profile](https://github.com/Burashewa)

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).

---

> “Empower learners to think like hackers — ethically, safely, and with purpose.”
> — *Biruk Shewafera*

```

