import { prisma } from "../libs/prisma.js";

export async function createPost(userId, content, caption) {
  return await prisma.post.create({
    data: {
      content,
      userId,
      caption,
    },
    // include: {
    //   user: true  if u ever need user details at the time of creation lakshay
    // }
  });
}

export async function getPosts(userId, skip = 0, take = 15,communities,connectionIds) {
  let whereClause = {};
  communities = communities.split(",");
  if(communities[0]!=""){
    whereClause.Community ={
        name:{
          in:communities,
        }
      }
    
  }
  if (connectionIds){
    whereClause.userId = {
      in: connectionIds,
    }
  }
  console.log(whereClause);
  const posts = await prisma.post.findMany({
    where: whereClause,
    skip,
    take,
    include: {

      Community:{
              select:{
                name:true,
                description:true,
              }
            },
      user: {
        select: {
          username: true,
          profileImage: true,
          profile:{
            select:{
              basic:true
            }
          }
        },
      },
      likes: {
        where: {
          userId,
        },
        select: {
          userId: true,
        },
      },
      comments: {
        skip: 0,
        take: 5,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              profileImage: true
            }
          },
          likes: {
            where: {
              userId,
            },
            select: {
              userId: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc", // Sorting baby
    },
  });
  return posts.map((post) => ({
    ...post,
    comments: post.comments.map((comment) => ({
      ...comment,
      isLiked: comment.likes.length > 0,
    })),
    isLiked: post.likes.length > 0,
  }));
}

export async function likeDislikePost(userId, postId) {
  return await prisma.$transaction(async (prisma) => {

    const existingLike = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    if (existingLike) {
      await prisma.postLike.delete({
        where: { id: existingLike.id }
      });

      await prisma.post.update({
        where: {
          id: postId
        },
        data:{
          likesCount: {decrement: 1}
        }
      })

      return { 
        isLiked: false }
    }

    await prisma.postLike.create({
      data: { userId, postId }
    });

    const post = await prisma.post.update({
      where: {
        id: postId
      },
      data:{
        likesCount: {
          increment: 1
        }
      }
    })
    console.log("phuck you nigga",post);
    return { isLiked: true ,postUserId:post.userId};
  }
);
}

export async function createComment(userId, postId, content) {
  const comment = await prisma.comment.create({
    data: {
      userId,
      postId,
      comment: content,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          profileImage: true
        }
      },
    },
  });
  const post = await prisma.post.update({
    where: {
      id: postId
    },
    data: {
      commentCount: {
        increment: 1
      }
    },
    include:{
      user:{
        select:{
          profileImage:true,
          profile:{
            select:{
              basic:true,
            }
          }
        }
      }
    }
  })
  console.log(post);
  return {comment,post};
}

export async function getComments(userId, postId, skip = 0, take = 3) {
  const comments = await prisma.comment.findMany({
    skip,
    take,
    where: {
      postId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          profileImage: true
        }
      },
      likes: {
        where: {
          userId,
        },
        select: {
          userId: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return comments.map((comment) => ({
    ...comment,
    isLiked: comment.likes.length > 0,
  }));
}

export async function likeDislikeComment(userId, commentId) {
  return await prisma.$transaction( async (prisma) => {
    const like = await prisma.commentLike.findFirst({
      where: {
        userId,
        commentId,
      },
    });
  
    if (like) {
      await prisma.commentLike.delete({
        where: {
          id: like.id,
        },
      });
  
      await prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          likesCount: {
            decrement: 1,
          },
        },
      });
  
      return {
        isLiked: false,
      };
    }
  
    await prisma.commentLike.create({
      data: {
        userId,
        commentId,
      },
    });
  
    await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        likesCount: {
          increment: 1,
        },
      },
    });
  
    return {
      isLiked: true,
    };
  })
}
