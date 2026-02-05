# 🚀 Modern E-Commerce DevOps Platform

A complete end-to-end DevOps project showcasing modern cloud-native architecture, CI/CD pipelines, and Kubernetes orchestration.

## 📋 Project Overview

This project demonstrates a production-ready e-commerce platform built with:

- **Modern Tech Stack**: React, Node.js, MongoDB
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes on AWS EKS
- **CI/CD**: GitHub Actions with automated testing and security scanning
- **GitOps**: ArgoCD for declarative deployments
- **Observability**: Prometheus, Grafana, and Loki
- **Security**: Multi-layer scanning (Trivy, Snyk, SonarCloud)

## 🏗️ Architecture
```
Developer → GitHub → GitHub Actions (CI/CD) → Docker Hub → 
    → AWS EKS (Kubernetes) → ArgoCD → 
        → Frontend + Backend + MongoDB → 
            → Monitoring (Prometheus + Grafana)
```

## 🛠️ Tech Stack

### Frontend
- React 18
- Axios for API calls
- NGINX for serving

### Backend
- Node.js 20
- Express.js
- MongoDB with Mongoose
- Security: Helmet, CORS, Rate Limiting

### DevOps Tools
- **Containers**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Code Quality**: SonarCloud
- **Security**: Trivy, Snyk
- **Monitoring**: Prometheus, Grafana
- **GitOps**: ArgoCD
- **Cloud**: AWS (EKS, ECR, S3)

## 📁 Project Structure
```
modern-ecommerce-devops/
├── .github/workflows/          # CI/CD pipelines
├── backend/                    # Node.js API
│   ├── src/
│   ├── tests/
│   └── Dockerfile
├── frontend/                   # React application
│   ├── src/
│   ├── public/
│   └── Dockerfile
├── kubernetes/                 # K8s manifests
│   ├── base/
│   ├── monitoring/
│   └── argocd/
├── terraform/                  # Infrastructure as Code
├── scripts/                    # Automation scripts
└── docker-compose.yml          # Local development
```

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for local development)
- Git

### Local Development with Docker Compose

1. **Clone the repository**
```bash
   git clone https://github.com/TejaswiniMarri-Git/modern-ecommerce-devops.git
   cd modern-ecommerce-devops
```

2. **Start all services**
```bash
   docker-compose up -d
```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

4. **Check service health**
```bash
   docker-compose ps
   docker-compose logs -f backend
```

5. **Stop all services**
```bash
   docker-compose down
```

### Local Development without Docker

**Backend:**
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

## 🧪 Testing

**Backend Tests:**
```bash
cd backend
npm test
```

**Frontend Tests:**
```bash
cd frontend
npm test
```

## 📊 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/status` - Update order status

### System
- `GET /health` - Health check
- `GET /ready` - Readiness check
- `GET /metrics` - Prometheus metrics
- `GET /api/stats` - Dashboard statistics

## 🔐 Security Features

- **Container Security**: Non-root users, minimal base images
- **API Security**: Helmet, CORS, rate limiting
- **Secrets Management**: Environment variables, AWS Secrets Manager
- **Network Security**: Kubernetes Network Policies
- **Vulnerability Scanning**: Trivy, Snyk
- **Code Quality**: SonarCloud analysis

## 📈 Monitoring

- **Metrics**: Prometheus collects application and system metrics
- **Visualization**: Grafana dashboards for real-time insights
- **Logging**: Centralized logging with Loki
- **Alerts**: AlertManager for critical notifications
## 🚢 Deployment

### Using Docker Compose (Development)
```bash
```

### Using Kubernetes (Production)
```bash
# Apply Kubernetes manifests
kubectl apply -f kubernetes/base/
# Or use ArgoCD (GitOps)
kubectl apply -f kubernetes/argocd/application.yaml
```

### Using Terraform (Infrastructure)
```bash
terraform init
terraform plan
terraform apply
```
## 🎯 DevOps Pipeline

1. **Code Commit** → Push to GitHub
3. **Build & Test** → Run unit tests
5. **Build Images** → Docker multi-stage builds
6. **Push to Registry** → Docker Hub
7. **Deploy** → ArgoCD syncs to Kubernetes

## 🌟 Key Features
- ✅ Modern microservices architecture
- ✅ Containerized with Docker
- ✅ Orchestrated with Kubernetes
- ✅ Automated CI/CD with GitHub Actions
- ✅ GitOps deployment with ArgoCD
- ✅ Multi-layer security scanning
- ✅ Infrastructure as Code with Terraform
- ✅ Auto-scaling with HPA
- ✅ Production-ready configurations

## 📚 Documentation

- [Architecture Details](docs/architecture.md)
- [Deployment Guide](docs/deployment-guide.md)
- [Monitoring Guide](docs/monitoring-guide.md)
- [Troubleshooting](docs/troubleshooting.md)

## 🤝 Contributing

This is a portfolio/demo project. Feel free to fork and customize for your own use!

## 👤 Author

**Tejaswini Marri**
- GitHub: [@TejaswiniMarri-Git](https://github.com/TejaswiniMarri-Git)
- LinkedIn: [Your LinkedIn]
- Portfolio: [Your Portfolio]

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Built as a demonstration of modern DevOps practices and cloud-native architecture.

---

**⭐ If you find this project useful, please give it a star!**- ✅ Comprehensive monitoring and logging

8. **Monitor** → Prometheus + Grafana
4. **Security Scan** → Trivy, Snyk, SonarCloud
2. **CI Pipeline** → GitHub Actions triggers

cd terraform

docker-compose up -d

