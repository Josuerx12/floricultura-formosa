-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('ADMIN', 'USER', 'SELLER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRoles" DEFAULT 'USER';
