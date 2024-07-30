-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "contentZh" TEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "contentZh" TEXT,
ADD COLUMN     "titleZh" TEXT;
