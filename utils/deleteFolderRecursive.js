async function deleteFolderRecursive(prisma, folderId, userId) {
    await prisma.file.deleteMany({
        where: {
            folderId,
            userId
        }
    });

    const subfolders = await prisma.folder.findMany({
        where: {
            parentId: folderId,
            userId
        }
    });

    for (const subfolder of subfolders) {
        await deleteFolderRecursive(prisma, subfolder.id, userId);
    }

    await prisma.folder.delete({
        where: { id: folderId }
    });
}

module.exports = deleteFolderRecursive;