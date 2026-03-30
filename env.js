DATABASE_URL="mongodb+srv://fundee_admin_db:Ul0h6u6yWba2SDTy@fundee-cluster.rkcnsrk.mongodb.net/?appName=fundee-cluster"
MONGODB_DB_NAME="Fundee"

# Better Auth
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="change-this-to-a-random-32-char-string"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
BUSINESS_JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# App Configuration
NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Upload Configuration
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE=5242880

# FedaPay
FEDAPAY_SECRET_KEY=sk_sandbox_...
FEDAPAY_ENVIRONMENT=sandbox

#Cloudinary ( Informations à modifier en prod )
CLOUDINARY_CLOUD_NAME="dq6ttt5so"
CLOUDINARY_API_KEY="953843746643599"
CLOUDINARY_API_SECRET="3693dBi3rejAzlK3HMl-VdYOWK4"

#Environnement pour forgot-password ( Informations à modifier en prod )
GMAIL_USER="valdesagbokoni01@gmail.com"
GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"