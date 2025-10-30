-- AlterTable
ALTER TABLE "users" ADD COLUMN     "username" TEXT,
ALTER COLUMN "fname" DROP NOT NULL,
ALTER COLUMN "lname" DROP NOT NULL;
