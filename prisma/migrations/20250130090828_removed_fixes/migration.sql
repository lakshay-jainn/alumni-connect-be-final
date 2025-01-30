/*
  Warnings:

  - You are about to drop the column `likesCount` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `likesCount` on the `Post` table. All the data in the column will be lost.
  - Made the column `commentId` on table `CommentLike` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postId` on table `PostLike` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CommentLike" DROP CONSTRAINT "CommentLike_commentId_fkey";

-- DropForeignKey
ALTER TABLE "PostLike" DROP CONSTRAINT "PostLike_postId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "likesCount";

-- AlterTable
ALTER TABLE "CommentLike" ALTER COLUMN "commentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "likesCount";

-- AlterTable
ALTER TABLE "PostLike" ALTER COLUMN "postId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
