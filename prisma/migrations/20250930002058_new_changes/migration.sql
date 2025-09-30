-- CreateEnum
CREATE TYPE "public"."Roles" AS ENUM ('user', 'admin', 'super_admin', 'manager');

-- CreateEnum
CREATE TYPE "public"."Providers" AS ENUM ('google', 'facebook', 'local');

-- CreateEnum
CREATE TYPE "public"."AccountStatus" AS ENUM ('pending', 'verified', 'banned');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "account_status" "public"."AccountStatus" NOT NULL DEFAULT 'pending',
    "avatar" TEXT,
    "provider" "public"."Providers" NOT NULL DEFAULT 'local',
    "role" "public"."Roles" NOT NULL DEFAULT 'user',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."posts" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "authorId" TEXT,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."posts" ADD CONSTRAINT "posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
