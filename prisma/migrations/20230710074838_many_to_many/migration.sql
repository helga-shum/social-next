/*
  Warnings:

  - You are about to drop the `_PostToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PostToUser" DROP CONSTRAINT "_PostToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostToUser" DROP CONSTRAINT "_PostToUser_B_fkey";

-- DropTable
DROP TABLE "_PostToUser";

-- CreateTable
CREATE TABLE "SavedPostsOnUser" (
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedPostsOnUser_pkey" PRIMARY KEY ("postId","userId")
);

-- CreateTable
CREATE TABLE "SharedPostsOnUser" (
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sharedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedPostsOnUser_pkey" PRIMARY KEY ("postId","userId")
);

-- AddForeignKey
ALTER TABLE "SavedPostsOnUser" ADD CONSTRAINT "SavedPostsOnUser_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedPostsOnUser" ADD CONSTRAINT "SavedPostsOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedPostsOnUser" ADD CONSTRAINT "SharedPostsOnUser_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedPostsOnUser" ADD CONSTRAINT "SharedPostsOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
