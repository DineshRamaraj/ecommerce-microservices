# User Service - E-commerce Microservices

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-green.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18+-lightgrey.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A robust, production-ready user authentication and management microservice built with Node.js, TypeScript, Express, and MongoDB. This service handles user registration, authentication, profile management, and role-based authorization with enterprise-grade security features.

## 🌟 Features

### 🔐 Authentication & Security
- **JWT Authentication** with access and refresh tokens
- **Password Security** using bcrypt with configurable rounds
- **Account Lockout Protection** against brute force attacks
- **Role-Based Authorization** (Customer, Admin, Vendor)
- **Secure HTTP-Only Cookies** for refresh token storage
- **Email Validation** and account verification

### 👤 User Management
- **User Registration** with comprehensive validation
- **Profile Management** with basic user information
- **Password Change** with current password verification
- **User Status Management** (Active, Inactive, Suspended, Pending)
- **Admin User Management** with pagination and search

### 🏗️ Microservices Architecture
- **Database Per Service** pattern implementation
- **Service Discovery Ready** with health check endpoints
- **Horizontal Scaling** capabilities
- **Independent Deployment** support
- **Future Service Integration** hooks for role-specific profiles

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime Environment | 18+ |
| **TypeScript** | Type Safety | 5.0+ |
| **Express.js** | Web Framework | 4.18+ |
| **MongoDB** | Database | 5.0+ |
| **Mongoose** | ODM | 7.8+ |
| **JWT** | Authentication | 9.0+ |
| **bcryptjs** | Password Hashing | 2.4+ |
| **Helmet** | Security Headers | 7.0+ |
| **Morgan** | Logging | 1.10+ |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB 5.0+ running
- npm or pnpm package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd user-service

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env

# Start development server
npm run dev

user-service/
├── src/
│   ├── config/
│   │   └── database.ts              # MongoDB connection
│   ├── controllers/
│   │   └── user.controller.ts       # HTTP request handlers
│   ├── middleware/
│   │   └── auth.middleware.ts       # Auth & authorization
│   ├── models/
│   │   └── user.model.ts            # MongoDB schema
│   ├── routes/
│   │   └── user.routes.ts           # API routes
│   ├── services/
│   │   └── user.service.ts          # Business logic
│   ├── utils/
│   │   ├── jwt.utils.ts             # JWT utilities
│   │   └── response.utils.ts        # Response formatting
│   └── app.ts                       # Express app
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── .env                             # Environment variables
└── README.md                        # This file

