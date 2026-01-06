const { PrismaClient, UserRole } = require("@prisma/client");

const prisma = new PrismaClient();

async function updateAdminsToVip() {
  try {
    console.log("Starting update of ADMIN users to VIP...");

    // Update all users with ADMIN role to VIP
    const result = await prisma.user.updateMany({
      where: {
        role: UserRole.ADMIN,
      },
      data: {
        role: UserRole.VIP,
      },
    });

    console.log(
      `✅ Successfully updated ${result.count} user(s) from ADMIN to VIP`
    );

    // Display updated users
    const updatedUsers = await prisma.user.findMany({
      where: {
        role: UserRole.VIP,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    console.log("\nUpdated users:");
    console.table(updatedUsers);
  } catch (error) {
    console.error("❌ Error updating users:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
updateAdminsToVip();
