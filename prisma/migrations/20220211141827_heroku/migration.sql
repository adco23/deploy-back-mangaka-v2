-- CreateEnum
CREATE TYPE "State" AS ENUM ('Finished', 'on_going', 'on_pause');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatar" BYTEA NOT NULL,
    "password" TEXT,
    "about" TEXT NOT NULL,
    "coins" INTEGER NOT NULL DEFAULT 0,
    "creatorMode" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "library" INTEGER[],
    "favorites" INTEGER[],
    "wishList" INTEGER[],
    "googleId" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manga" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "image" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uptadedAt" TIMESTAMP(3) NOT NULL,
    "genre" TEXT[],
    "rating" DOUBLE PRECISION NOT NULL,
    "chapter" INTEGER NOT NULL,
    "state" TEXT NOT NULL,

    CONSTRAINT "Manga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "coverImage" BYTEA NOT NULL,
    "images" BYTEA[],
    "mangaId" INTEGER NOT NULL,
    "usersId" TEXT[],
    "price" INTEGER NOT NULL,

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternalOrder" (
    "orderId" SERIAL NOT NULL,
    "sellerId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "InternalOrder_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "externalOrder" (
    "orderId" SERIAL NOT NULL,
    "adminId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "externalOrder_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "coinsPackage" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "sellprice" INTEGER NOT NULL,
    "buyprice" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "coinsPackage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Manga_title_key" ON "Manga"("title");

-- AddForeignKey
ALTER TABLE "Manga" ADD CONSTRAINT "Manga_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "Manga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalOrder" ADD CONSTRAINT "InternalOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
