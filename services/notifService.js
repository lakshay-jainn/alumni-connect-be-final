

export async function createNotif(userIds,name,action,description,logo,url=null) {

  try {
      const data = userIds.map(userId => ({
      userId,
      name,
      action,
      description,
      logo,
      url
    }));

    await prisma.notification.createMany({
      data,
      skipDuplicates: false, // optional: avoids inserting duplicates if needed
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}