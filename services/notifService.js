

export async function createNotif(userId,name,action,description,logo,url=null) {

  try {
    const notif = await prisma.notification.create({
      data:{
        userId:userId,
        name:name,
        action:action,
        description:description,
        logo:logo,
        url:url

      }
    })
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}