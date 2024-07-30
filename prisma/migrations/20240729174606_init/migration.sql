-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "redditId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "subreddit" TEXT NOT NULL,
    "author" TEXT,
    "score" INTEGER NOT NULL,
    "upvoteRatio" DOUBLE PRECISION NOT NULL,
    "numComments" INTEGER NOT NULL,
    "permalink" TEXT NOT NULL,
    "createdUtc" TIMESTAMP(3) NOT NULL,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "redditId" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "author" TEXT,
    "content" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdUtc" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Post_redditId_key" ON "Post"("redditId");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_redditId_key" ON "Comment"("redditId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
