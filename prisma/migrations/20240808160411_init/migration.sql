-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isEmailVerifed" BOOLEAN NOT NULL DEFAULT false,
    "roles" INTEGER NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Books" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publicationDate" TIMESTAMP(3) NOT NULL,
    "genres" TEXT[],

    CONSTRAINT "Books_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");
